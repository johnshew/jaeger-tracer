"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const opentracing_1 = require("opentracing");
const constants_1 = require("./constants");
const requestWrappers_1 = require("./requestWrappers");
const mung = require('express-mung');
exports.setReqSpanData = (req, res, span) => {
    span.setTag(opentracing_1.Tags.HTTP_URL, req.path());
    span.setTag(opentracing_1.Tags.HTTP_METHOD, req.method);
    span.setTag('Hostname', req.headers.host);
    span.log({
        event: 'request',
        body: req.body,
        params: req.params,
        query: req.query,
        headers: req.headers,
    });
    return span;
};
exports.setResSpanData = (req, res, span, filterFunction) => {
    res.once('error', function (err) {
        span.log({
            event: 'response',
            status: 'error',
            error: err,
            headers: this.getHeaders ? this.getHeaders() : this.headers || {},
            statusCode: this.statusCode || 'no status found',
        });
        span.finish();
    });
    let responseSpanLog = {
        event: 'response',
    };
    res.once('finish', function () {
        span.log(applyDataFilter(filterFunction, {
            ...responseSpanLog,
            headers: this.getHeaders ? this.getHeaders() : this.headers || {},
            statusCode: this.statusCode || 'no status found',
            statusMessage: this.statusMessage || 'no message found',
        }));
        span.finish();
    });
    const responseInterceptor = (body, req, res) => {
        responseSpanLog = {
            ...responseSpanLog,
            status: 'normal',
            body,
        };
        return body;
    };
    return mung.json(responseInterceptor);
};
let isHttpRequestSaverExecuted = false;
exports.putParentHeaderInOutgoingRequests = ({ http, https }, tracer, span) => {
    const headers = requestWrappers_1.getInjectionHeaders(tracer, span);
    if (!isHttpRequestSaverExecuted) {
        constants_1.Constants.httpObjects = { http: http.request, https: https.request };
        Object.freeze(constants_1.Constants.httpObjects);
        isHttpRequestSaverExecuted = true;
    }
    const newRequestHttp = function (...args) {
        return constants_1.Constants.httpObjects.http(...manipulateRequestArgs(args, headers));
    };
    const newRequestHttps = function (...args) {
        return constants_1.Constants.httpObjects.https(...manipulateRequestArgs(args, headers));
    };
    http.request = newRequestHttp;
    https.request = newRequestHttps;
};
function manipulateRequestArgs(args, newHeaders) {
    const stdObject = args[2];
    const isThisStdObject = typeof stdObject === 'object' && stdObject.stdObject;
    if (isThisStdObject) {
        newHeaders = stdObject.headers;
    }
    if (!isThisStdObject) {
        args[1] = theNothingFunction;
        args[2] = { stdObject: true, headers: newHeaders };
    }
    if (args[0] && args[0].headers) {
        args[0].headers = { ...args[0].headers || {}, ...newHeaders || {} };
    }
    return args;
}
const theNothingFunction = () => null;
async function applyDataFilter(filterFunction, data) {
    if (!filterFunction) {
        return data;
    }
    const result = filterFunction(data);
    if (result.then) {
        return await result;
    }
    return result;
}
//# sourceMappingURL=spanDataSetter.js.map