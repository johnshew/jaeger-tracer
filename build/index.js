"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ClsManager_1 = require("./ClsManager");
var tracer_1 = require("./tracer");
var span_1 = require("./span");
var middleware_1 = require("./middleware");
var requestWrappers_1 = require("./requestWrappers");
exports.initTracer = tracer_1.initTracer;
exports.makeSpan = span_1.makeSpan;
exports.makeSpanWithParent = span_1.makeSpanWithParent;
exports.spanMaker = span_1.spanMaker;
exports.jaegarTracerMiddleware = middleware_1.jaegarTracerMiddleWare;
exports.middlewareTracer = middleware_1.tracer;
exports.getContext = ClsManager_1.getContext;
exports.unirestWrapper = requestWrappers_1.unirestWrapper;
exports.requestWrapper = requestWrappers_1.requestWrapper;
exports.getInjectionHeaders = requestWrappers_1.getInjectHeaders;
//# sourceMappingURL=index.js.map