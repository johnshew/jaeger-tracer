"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ClsManager_1 = require("./ClsManager");
var span_1 = require("./span");
var spanDataSetter_1 = require("./spanDataSetter");
var tracer_1 = require("./tracer");
var FORMAT_HTTP_HEADERS = require('opentracing').FORMAT_HTTP_HEADERS;
exports.jaegarTracerMiddleWare = function (serviceName, config, options) {
    var tracer = tracer_1.initTracer(serviceName, config, options);
    return function (req, res, next) {
        var parentSpanContext = tracer.extract(FORMAT_HTTP_HEADERS, req.headers);
        var mainReqSpan = span_1.spanMaker(req.path, parentSpanContext, tracer);
        spanDataSetter_1.setReqSpanData(req, res, mainReqSpan);
        var responseInterceptor = spanDataSetter_1.setResSpanData(req, res, mainReqSpan);
        ClsManager_1.associateNMSWithReqBeforeGoingNext(req, res, next, mainReqSpan, responseInterceptor);
    };
};
//# sourceMappingURL=middleware.js.map