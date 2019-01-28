"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ClsManager_1 = require("./ClsManager");
var constants_1 = require("./constants");
var FORMAT_HTTP_HEADERS = require('opentracing').FORMAT_HTTP_HEADERS;
exports.unirestWrapper = function (unirest) {
    if (!unirest.request)
        throw Error('This is not a unirest object please provide a unirest object');
    var baseRequest = unirest.request;
    var headers = exports.getInjectHeaders();
    baseRequest = baseRequest.defaults({
        headers: headers
    });
    unirest.request = baseRequest;
    return unirest;
};
exports.requestWrapper = function (request) {
    if (!request.defaults)
        throw Error('This is not a request object please provide a request object');
    var headers = exports.getInjectHeaders();
    var baseRequest = request.defaults({
        headers: headers
    });
    return baseRequest;
};
exports.getInjectHeaders = function () {
    var tracer = ClsManager_1.getFromCls(constants_1.constants.tracer);
    var span = ClsManager_1.getFromCls(constants_1.constants.mainSpan);
    var headers = {};
    tracer.inject(span, FORMAT_HTTP_HEADERS, headers);
    return headers;
};
//# sourceMappingURL=requestWrappers.js.map