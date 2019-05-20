"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var clsManager_1 = require("./clsManager");
var constants_1 = require("./constants");
exports.startSpan = function (name, parentContext, tracer) {
    var span = null;
    if (!parentContext || (parentContext && !parentContext.spanId)) {
        return tracer.startSpan(name);
    }
    clsManager_1.setInJaegerNamespace(constants_1.Constants.parentContext, parentContext);
    return tracer.startSpan(name, {
        childOf: parentContext,
    });
};
exports.startSpanFromJaegerNamespace = function (name, parentContext) {
    var tracer = clsManager_1.getFromJaegerNamespace(constants_1.Constants.tracer);
    if (!parentContext) {
        parentContext = clsManager_1.getFromJaegerNamespace(constants_1.Constants.parentContext);
    }
    return exports.startSpan(name, parentContext || null, tracer);
};
exports.getMainSpan = function () {
    return clsManager_1.getFromJaegerNamespace(constants_1.Constants.mainSpan);
};
//# sourceMappingURL=span.js.map