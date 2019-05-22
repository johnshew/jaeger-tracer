"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const continuation_local_storage_1 = require("continuation-local-storage");
const opentracing_1 = require("opentracing");
const clsManager_1 = require("./clsManager");
const constants_1 = require("./constants");
const span_1 = require("./span");
const spanDataSetter_1 = require("./spanDataSetter");
const tracer_1 = require("./tracer");
exports.session = continuation_local_storage_1.getNamespace(constants_1.Constants.jeagerClsNamespace);
exports.jaegarTracerMiddleWare = function (httpModules, serviceName, config = {}, options = {}) {
    if (!shouldTrace(config.shouldTrace)) {
        return (req, res, next) => next();
    }
    exports.tracer = tracer_1.initTracer(serviceName, config, options);
    const middleware = (req, res, next) => {
        exports.session.run(() => {
            clsManager_1.setInJaegerNamespace(constants_1.Constants.tracer, exports.tracer);
            const parentSpanContext = exports.tracer.extract(opentracing_1.FORMAT_HTTP_HEADERS, req.headers);
            const mainReqSpan = span_1.startSpan(req.path(), parentSpanContext, exports.tracer);
            spanDataSetter_1.setReqSpanData(req, res, mainReqSpan);
            const responseInterceptor = spanDataSetter_1.setResSpanData(req, res, mainReqSpan, options.filterData);
            spanDataSetter_1.putParentHeaderInOutgoingRequests(httpModules, exports.tracer, mainReqSpan);
            clsManager_1.associateNMSWithReqBeforeGoingNext(req, res, next, mainReqSpan, responseInterceptor);
        });
    };
    return middleware;
};
function shouldTrace(isTraceWorking) {
    if (isTraceWorking === undefined) {
        return true;
    }
    const type = typeof isTraceWorking;
    if (type === 'boolean') {
        return isTraceWorking;
    }
    if (type === 'function') {
        return isTraceWorking();
    }
    throw Error('shouldTrace value should of type "boolean" or "function" that returns a boolean');
}
//# sourceMappingURL=middleware.js.map