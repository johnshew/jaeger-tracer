"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var clsManager_1 = require("./clsManager");
var constants_1 = require("./constants");
exports.spanStart = function (name, parentContext, tracer) {
    var span = null;
    if (!parentContext || (parentContext && !parentContext.spanId))
        return tracer.startSpan(name);
    clsManager_1.saveToCls(constants_1.constants.parentContext, parentContext);
    return tracer.startSpan(name, {
        childOf: parentContext
    });
};
exports.makeSpan = function (name) {
    var tracer = clsManager_1.getFromCls(constants_1.constants.tracer);
    var parentContext = clsManager_1.getFromCls(constants_1.constants.parentContext);
    return exports.spanStart(name, parentContext, tracer);
};
exports.makeSpanWithParent = function (name, parentContext) {
    var tracer = clsManager_1.getFromCls(constants_1.constants.tracer);
    return exports.spanStart(name, parentContext, tracer);
};
exports.getMainSpan = function () {
    return clsManager_1.getFromCls(constants_1.constants.mainSpan);
};
//# sourceMappingURL=span.js.map