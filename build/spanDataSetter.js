"use strict";
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
            headers: res.getHeaders()
        });
        span.finish();
    });
    res.once('finish', function () {
        span.finish();
    });
    var responseInterceptor = function (body, req, res) {
        span.log({
            event: 'response',
            status: 'normal',
            statusCode: res.statusCode,
            body: body,
            headers: res.getHeaders(),
        });
        return body;
    };
    return express_mung_1.json(responseInterceptor);
};
//# sourceMappingURL=spanDataSetter.js.map