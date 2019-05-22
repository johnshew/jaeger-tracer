"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const clsManager_1 = require("./clsManager");
const constants_1 = require("./constants");
const { FORMAT_HTTP_HEADERS } = require('opentracing');
exports.unirestWrapper = (unirest) => {
    if (!unirest.request) {
        throw Error('This is not a unirest object please provide a unirest object');
    }
    let baseRequest = unirest.request;
    const headers = exports.getInjectionHeaders();
    baseRequest = baseRequest.defaults({
        headers,
    });
    unirest.request = baseRequest;
    return unirest;
};
exports.requestWrapper = (request) => {
    if (!request.defaults) {
        throw Error('This is not a request object please provide a request object');
    }
    const headers = exports.getInjectionHeaders();
    const baseRequest = request.defaults({
        headers,
    });
    return baseRequest;
};
exports.getInjectionHeaders = (tracerObject, spanObject) => {
    const tracer = tracerObject || clsManager_1.getFromJaegerNamespace(constants_1.Constants.tracer);
    const span = spanObject || clsManager_1.getFromJaegerNamespace(constants_1.Constants.mainSpan);
    const headers = {};
    tracer && span && tracer.inject(span, FORMAT_HTTP_HEADERS, headers);
    return headers;
};
//# sourceMappingURL=requestWrappers.js.map