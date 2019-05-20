"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var clsManager_1 = require("./clsManager");
var constants_1 = require("./constants");
var FORMAT_HTTP_HEADERS = require('opentracing').FORMAT_HTTP_HEADERS;
exports.unirestWrapper = function (unirest) {
    if (!unirest.request) {
        throw Error('This is not a unirest object please provide a unirest object');
    }
    var baseRequest = unirest.request;
    var headers = exports.getInjectionHeaders();
    baseRequest = baseRequest.defaults({
        headers: headers,
    });
    unirest.request = baseRequest;
    return unirest;
};
exports.requestWrapper = function (request) {
    if (!request.defaults) {
        throw Error('This is not a request object please provide a request object');
    }
    var headers = exports.getInjectionHeaders();
    var baseRequest = request.defaults({
        headers: headers,
    });
    return baseRequest;
};
exports.getInjectionHeaders = function (tracerObject, spanObject) {
    var tracer = tracerObject || clsManager_1.getFromJaegerNamespace(constants_1.Constants.tracer);
    var span = spanObject || clsManager_1.getFromJaegerNamespace(constants_1.Constants.mainSpan);
    var headers = {};
    tracer && span && tracer.inject(span, FORMAT_HTTP_HEADERS, headers);
    return headers;
};
//# sourceMappingURL=requestWrappers.js.map