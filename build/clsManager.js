"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const continuation_local_storage_1 = require("continuation-local-storage");
const constants_1 = require("./constants");
const session = continuation_local_storage_1.createNamespace(constants_1.Constants.jeagerClsNamespace);
exports.associateNMSWithReqBeforeGoingNext = (req, res, next, mainSpan, interceptorMiddleware) => {
    session.bindEmitter(req);
    session.bindEmitter(res);
    exports.setInJaegerNamespace(constants_1.Constants.mainSpan, mainSpan);
    session.run(() => {
        interceptorMiddleware(req, res, next);
    });
};
exports.setInJaegerNamespace = (key, value) => {
    return session.set(key, value);
};
exports.getFromJaegerNamespace = (key) => {
    return session.get(key);
};
exports.getJaegerNamespace = () => {
    return session;
};
//# sourceMappingURL=clsManager.js.map