"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mergeDeep = require('merge-deep');
var initJaegerTracer = require('jaeger-client').initTracer;
exports.initTracer = function (serviceName, config, options) {
    if (config === void 0) { config = {}; }
    if (options === void 0) { options = {}; }
    config = mergeDeep({
        serviceName: serviceName,
        sampler: {
            type: 'const',
            param: 1,
        },
        reporter: {
            logSpans: true,
            agentHost: 'jaegar',
        },
    }, config);
    options = mergeDeep({
        logger: {
            info: function (msg) {
                console.log('INFO ', msg);
            },
            error: function (msg) {
                console.log('ERROR', msg);
            },
        },
    }, options);
    var tracer = initJaegerTracer(config, options);
    return tracer;
};
//# sourceMappingURL=tracer.js.map