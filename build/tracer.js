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
Object.defineProperty(exports, "__esModule", { value: true });
var initJaegerTracer = require('jaeger-client').initTracer;
exports.initTracer = function (serviceName, config, options) {
    if (config === void 0) { config = {}; }
    if (options === void 0) { options = {}; }
    config = __assign({ serviceName: serviceName, sampler: {
            type: "const",
            param: 1,
        }, reporter: {
            logSpans: true,
            agentHost: 'jaegar'
        } }, config);
    options = __assign({ logger: {
            info: function (msg) {
                console.log("INFO ", msg);
            },
            error: function (msg) {
                console.log("ERROR", msg);
            },
        } }, options);
    var tracer = initJaegerTracer(config, options);
    return tracer;
};
//# sourceMappingURL=tracer.js.map