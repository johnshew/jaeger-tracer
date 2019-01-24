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
            headers: this.getHeaders(),
            statusCode: this.statusCode
        });
        span.finish();
    });
    var responseSpanLog = {
        event: 'response',
    };
    res.once('finish', function () {
        span.log(__assign({}, responseSpanLog, { headers: this.getHeaders(), statusCode: this.statusCode, statusMessage: this.statusMessage }));
        span.finish();
    });
    var responseInterceptor = function (body, req, res) {
        responseSpanLog = __assign({}, responseSpanLog, { status: 'normal', body: body });
        return body;
    };
    return express_mung_1.json(responseInterceptor, { mungError: true });
};
//# sourceMappingURL=spanDataSetter.js.map