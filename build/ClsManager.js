"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cls_hooked_1 = require("cls-hooked");
var constants_1 = require("./constants");
var session = cls_hooked_1.createNamespace(constants_1.constants.clsNamespace);
exports.associateNMSWithReqBeforeGoingNext = session.bind(function (req, res, next, mainSpan, interceptorMiddleware) {
    session.bindEmitter(req);
    session.bindEmitter(res);
    exports.saveToCls(constants_1.constants.mainSpan, mainSpan);
    session.run(function () {
        interceptorMiddleware(req, res, next);
    });
});
exports.saveToCls = session.bind(function (key, value) {
    return session.set(key, value);
});
exports.getFromCls = session.bind(function (key) {
    return session.get(key);
});
exports.getContext = session.bind(function () {
    return session;
});
//# sourceMappingURL=ClsManager.js.map