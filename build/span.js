"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var clsManager_1 = require("./clsManager");
var constants_1 = require("./constants");
exports.startSpan = function (name, parentContext, tracer) {
    var span = null;
    if (!parentContext || (parentContext && !parentContext.spanId))
        return tracer.startSpan(name);
    clsManager_1.saveToCls(constants_1.constants.parentContext, parentContext);
    return tracer.startSpan(name, {
        childOf: parentContext
    });
};
exports.startSpanFromContext = function (name, parentContext) {
    var tracer = clsManager_1.getFromCls(constants_1.constants.tracer);
    if (!parentContext)
        parentContext = clsManager_1.getFromCls(constants_1.constants.parentContext);
    return exports.startSpan(name, parentContext || null, tracer);
};
exports.getMainSpan = function () {
    return clsManager_1.getFromCls(constants_1.constants.mainSpan);
};
//# sourceMappingURL=span.js.map