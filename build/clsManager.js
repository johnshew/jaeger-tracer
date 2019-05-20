"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var continuation_local_storage_1 = require("continuation-local-storage");
var constants_1 = require("./constants");
var session = continuation_local_storage_1.createNamespace(constants_1.Constants.jeagerClsNamespace);
exports.associateNMSWithReqBeforeGoingNext = function (req, res, next, mainSpan, interceptorMiddleware) {
    session.bindEmitter(req);
    session.bindEmitter(res);
    exports.setInJaegerNamespace(constants_1.Constants.mainSpan, mainSpan);
    session.run(function () {
        interceptorMiddleware(req, res, next);
    });
};
exports.setInJaegerNamespace = function (key, value) {
    return session.set(key, value);
};
exports.getFromJaegerNamespace = function (key) {
    return session.get(key);
};
exports.getJaegerNamespace = function () {
    return session;
};
//# sourceMappingURL=clsManager.js.map