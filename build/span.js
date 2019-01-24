"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ClsManager_1 = require("./ClsManager");
var constants_1 = require("./constants");
exports.spanMaker = function (name, parentContext, tracer) {
    if (!parentContext)
        return tracer.startSpan(name);
    return tracer.startSpan(name, {
        childOf: parentContext
    });
};
exports.makeSpan = function (name) {
    var tracer = ClsManager_1.getFromCls(constants_1.constants.tracer);
    var parentContext = ClsManager_1.getFromCls(constants_1.constants.parentContext);
    return exports.spanMaker(name, parentContext, tracer);
};
exports.makeSpanWithParent = function (name, parentContext) {
    var tracer = ClsManager_1.getFromCls(constants_1.constants.tracer);
    return exports.spanMaker(name, parentContext, tracer);
};
//# sourceMappingURL=span.js.map