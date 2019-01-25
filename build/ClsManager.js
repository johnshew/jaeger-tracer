"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var continuation_local_storage_1 = require("continuation-local-storage");
var constants_1 = require("./constants");
var session = continuation_local_storage_1.getNamespace(constants_1.constants.clsNamespace);
exports.associateNMSWithReqBeforeGoingNext = function (req, res, next, mainSpan, interceptorMiddleware) {
    session.bindEmitter(req);
    session.bindEmitter(res);
    exports.saveToCls(constants_1.constants.mainSpan, mainSpan);
    interceptorMiddleware(req, res, next);
};
exports.saveToCls = function (key, value) {
    return session.set(key, value);
};
exports.getFromCls = function (key) {
    return session.get(key);
};
exports.getContext = function () {
    return session;
};
//# sourceMappingURL=ClsManager.js.map