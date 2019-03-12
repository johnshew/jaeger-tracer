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
Object.defineProperty(exports, "__esModule", { value: true });
var express_mung_1 = require("express-mung");
var Tags = require('opentracing').Tags;
var requestWrappers_1 = require("./requestWrappers");
var constants_1 = require("./constants");
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
var isHttpRequestSaverExecuted = false;
exports.putParentHeaderInOutgoingRequests = function (_a, tracer, span) {
    var http = _a.http, https = _a.https;
    var headers = requestWrappers_1.getInjectHeaders(tracer, span);
    if (!isHttpRequestSaverExecuted) {
        constants_1.constants.httpObjects = { http: http.request, https: https.request };
        Object.freeze(constants_1.constants.httpObjects);
        isHttpRequestSaverExecuted = true;
    }
    var newRequestHttp = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _a;
        return (_a = constants_1.constants.httpObjects).http.apply(_a, manipulateRequestArgs(args, headers));
    };
    var newRequestHttps = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _a;
        return (_a = constants_1.constants.httpObjects).https.apply(_a, manipulateRequestArgs(args, headers));
    };
    http.request = newRequestHttp;
    https.request = newRequestHttps;
};
function manipulateRequestArgs(args, newHeaders) {
    var stdObject = args[2];
    var isThisStdObject = typeof stdObject === 'object' && stdObject.stdObject;
    if (isThisStdObject)
        newHeaders = stdObject.headers;
    if (!isThisStdObject) {
        args[1] = theNothingFunction;
        args[2] = { stdObject: true, headers: newHeaders };
    }
    if (args[0] && args[0]['headers'])
        args[0]['headers'] = __assign({}, args[0]['headers'] || {}, newHeaders || {});
    return args;
}
var theNothingFunction = function () { return null; };
//# sourceMappingURL=spanDataSetter.js.map