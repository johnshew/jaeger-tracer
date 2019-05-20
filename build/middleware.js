"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var continuation_local_storage_1 = require("continuation-local-storage");
var clsManager_1 = require("./clsManager");
var constants_1 = require("./constants");
var span_1 = require("./span");
var spanDataSetter_1 = require("./spanDataSetter");
var tracer_1 = require("./tracer");
var opentracing_1 = require("opentracing");
exports.session = continuation_local_storage_1.getNamespace(constants_1.constants.clsNamespace);
exports.jaegarTracerMiddleWare = function (httpModules, serviceName, config, options) {
    if (config === void 0) { config = {}; }
    if (options === void 0) { options = {}; }
    if (!shouldTrace(config.shouldTrace))
        return function (req, res, next) { return next(); };
    exports.tracer = tracer_1.initTracer(serviceName, config, options);
    var middleware = function (req, res, next) {
        exports.session.run(function () {
            clsManager_1.saveToCls(constants_1.constants.tracer, exports.tracer);
            var parentSpanContext = exports.tracer.extract(opentracing_1.FORMAT_HTTP_HEADERS, req.headers);
            var mainReqSpan = span_1.startSpan(req.path(), parentSpanContext, exports.tracer);
            spanDataSetter_1.setReqSpanData(req, res, mainReqSpan);
            var responseInterceptor = spanDataSetter_1.setResSpanData(req, res, mainReqSpan, options.filterData);
            spanDataSetter_1.putParentHeaderInOutgoingRequests(httpModules, exports.tracer, mainReqSpan);
            clsManager_1.associateNMSWithReqBeforeGoingNext(req, res, next, mainReqSpan, responseInterceptor);
        });
    };
    return middleware;
};
function shouldTrace(isTraceWorking) {
    if (isTraceWorking === undefined)
        return true;
    var type = typeof isTraceWorking;
    if (type === 'boolean') {
        return isTraceWorking;
    }
    if (type === 'function') {
        return isTraceWorking();
    }
    throw Error("shouldTrace value should of type \"boolean\" or \"function\" that returns a boolean");
}
//# sourceMappingURL=middleware.js.map