"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var opentracing_1 = require("opentracing");
var requestWrappers_1 = require("./requestWrappers");
var constants_1 = require("./constants");
var mung = require('mung');
exports.setReqSpanData = function (req, res, span) {
    span.setTag(opentracing_1.Tags.HTTP_URL, req.path());
    span.setTag(opentracing_1.Tags.HTTP_METHOD, req.method);
    span.setTag('Hostname', req.headers.host);
    span.log({
        event: 'request',
        body: req.body,
        params: req.params,
        query: req.query,
        headers: req.headers
    });
    return span;
};
exports.setResSpanData = function (req, res, span, filterFunction) {
    res.once('error', function (err) {
        span.log({
            event: 'response',
            status: 'error',
            error: err,
            headers: this.getHeaders ? this.getHeaders() : this.headers || {},
            statusCode: this.statusCode || 'no status found'
        });
        span.finish();
    });
    var responseSpanLog = {
        event: 'response',
    };
    res.once('finish', function () {
        span.log(applyDataFilter(filterFunction, __assign({}, responseSpanLog, { headers: this.getHeaders ? this.getHeaders() : this.headers || {}, statusCode: this.statusCode || 'no status found', statusMessage: this.statusMessage || 'no message found' })));
        span.finish();
    });
    var responseInterceptor = function (body, req, res) {
        responseSpanLog = __assign({}, responseSpanLog, { status: 'normal', body: body });
        return body;
    };
    return mung.json(responseInterceptor);
};
var isHttpRequestSaverExecuted = false;
exports.putParentHeaderInOutgoingRequests = function (_a, tracer, span) {
    var http = _a.http, https = _a.https;
    var headers = requestWrappers_1.getInjectHeaders(tracer, span);
    if (!isHttpRequestSaverExecuted) {
        constants_1.constants.httpObjects = { http: http.request, https: https.request };
        Object.freeze(constants_1.constants.httpObjects);
        isHttpRequestSaverExecuted = true;
    }
    var newRequestHttp = function () {
        var _a;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return (_a = constants_1.constants.httpObjects).http.apply(_a, manipulateRequestArgs(args, headers));
    };
    var newRequestHttps = function () {
        var _a;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return (_a = constants_1.constants.httpObjects).https.apply(_a, manipulateRequestArgs(args, headers));
    };
    http.request = newRequestHttp;
    https.request = newRequestHttps;
};
function manipulateRequestArgs(args, newHeaders) {
    var stdObject = args[2];
    var isThisStdObject = typeof stdObject === 'object' && stdObject.stdObject;
    if (isThisStdObject)
        newHeaders = stdObject.headers;
    if (!isThisStdObject) {
        args[1] = theNothingFunction;
        args[2] = { stdObject: true, headers: newHeaders };
    }
    if (args[0] && args[0]['headers'])
        args[0]['headers'] = __assign({}, args[0]['headers'] || {}, newHeaders || {});
    return args;
}
var theNothingFunction = function () { return null; };
function applyDataFilter(filterFunction, data) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!filterFunction)
                        return [2, data];
                    result = filterFunction(data);
                    if (!result.then) return [3, 2];
                    return [4, result];
                case 1: return [2, _a.sent()];
                case 2: return [2, result];
            }
        });
    });
}
//# sourceMappingURL=spanDataSetter.js.map