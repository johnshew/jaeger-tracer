"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_mung_1 = require("express-mung");
var Tags = require('opentracing').Tags;
var http = __importStar(require("http"));
var https = __importStar(require("https"));
var requestWrappers_1 = require("./requestWrappers");
exports.setReqSpanData = function (req, res, span) {
    span.setTag(Tags.HTTP_URL, req.path);
    span.setTag(Tags.HTTP_METHOD, req.method);
    span.setTag('Hostname', req.hostname);
    span.log({
        event: 'request',
        body: req.body,
        params: req.params,
        query: req.query,
        headers: req.headers
    });
    return span;
};
exports.setResSpanData = function (req, res, span) {
    res.once('error', function (err) {
        span.log({
            event: 'response',
            status: 'error',
            error: err,
            headers: this.getHeaders ? this.getHeaders() : this.headers || {},
            statusCode: this.statusCode || 'no status found'
        });
        span.finish();
    });
    var responseSpanLog = {
        event: 'response',
    };
    res.once('finish', function () {
        span.log(__assign({}, responseSpanLog, { headers: this.getHeaders ? this.getHeaders() : this.headers || {}, statusCode: this.statusCode || 'no status found', statusMessage: this.statusMessage || 'no message found' }));
        span.finish();
    });
    var responseInterceptor = function (body, req, res) {
        responseSpanLog = __assign({}, responseSpanLog, { status: 'normal', body: body });
        return body;
    };
    return express_mung_1.json(responseInterceptor, { mungError: true });
};
exports.putParentHeaderInOutgoingRequests = function (tracer, span) {
    var headers = requestWrappers_1.getInjectHeaders(tracer, span);
    var httpModule = http;
    var httpsModule = https;
    var oldHttpRequest = httpModule.request;
    var oldHttpsRequest = httpsModule.request;
    var newRequestHttp = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (args[0] && args[0]['headers'])
            args[0]['headers'] = __assign({}, args[0]['headers'], headers);
        return oldHttpRequest.apply(void 0, args);
    };
    var newRequestHttps = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (args[0] && args[0]['headers'])
            args[0]['headers'] = __assign({}, args[0]['headers'], headers);
        return oldHttpsRequest.apply(void 0, args);
    };
    httpModule.request = newRequestHttp;
    httpsModule.request = newRequestHttps;
};
//# sourceMappingURL=spanDataSetter.js.map