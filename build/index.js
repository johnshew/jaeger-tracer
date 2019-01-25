"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var continuation_local_storage_1 = require("continuation-local-storage");
var session = continuation_local_storage_1.createNamespace(constants_1.constants.clsNamespace);
var tracer_1 = require("./tracer");
var span_1 = require("./span");
var middleware_1 = require("./middleware");
var ClsManager_1 = require("./ClsManager");
var requestWrappers_1 = require("./requestWrappers");
var constants_1 = require("./constants");
exports.initTracer = tracer_1.initTracer;
exports.makeSpan = session.bind(span_1.makeSpan);
exports.makeSpanWithParent = session.bind(span_1.makeSpanWithParent);
exports.spanMaker = session.bind(span_1.spanMaker);
exports.jaegarTracerMiddleware = session.bind(middleware_1.jaegarTracerMiddleWare);
exports.getContext = session.bind(ClsManager_1.getContext);
exports.unirestWrapper = session.bind(requestWrappers_1.unirestWrapper);
exports.requestWrapper = session.bind(requestWrappers_1.requestWrapper);
//# sourceMappingURL=index.js.map