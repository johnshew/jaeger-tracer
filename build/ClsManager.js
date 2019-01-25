"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var continuation_local_storage_1 = require("continuation-local-storage");
var constants_1 = require("./constants");
var session = continuation_local_storage_1.createNamespace(constants_1.constants.clsNamespace);
exports.associateNMSWithReqBeforeGoingNext = session.bind(function (req, res, next, mainSpan, interceptorMiddleware) {
    session.bindEmitter(req);
    session.bindEmitter(res);
    exports.saveToCls(constants_1.constants.mainSpan, mainSpan);
    interceptorMiddleware(req, res, next);
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