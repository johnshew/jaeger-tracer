"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const clsManager_1 = require("./clsManager");
const constants_1 = require("./constants");
exports.startSpan = (name, parentContext, tracer) => {
    const span = null;
    if (!parentContext || (parentContext && !parentContext.spanId)) {
        return tracer.startSpan(name);
    }
    clsManager_1.setInJaegerNamespace(constants_1.Constants.parentContext, parentContext);
    return tracer.startSpan(name, {
        childOf: parentContext,
    });
};
exports.startSpanFromJaegerNamespace = (name, parentContext) => {
    const tracer = clsManager_1.getFromJaegerNamespace(constants_1.Constants.tracer);
    if (!parentContext) {
        parentContext = clsManager_1.getFromJaegerNamespace(constants_1.Constants.parentContext);
    }
    return exports.startSpan(name, parentContext || null, tracer);
};
exports.getMainSpan = () => {
    return clsManager_1.getFromJaegerNamespace(constants_1.Constants.mainSpan);
};
//# sourceMappingURL=span.js.map