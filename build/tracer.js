"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mergeDeep = require('merge-deep');
const { initTracer: initJaegerTracer } = require('jaeger-client');
exports.initTracer = (serviceName, config = {}, options = {}) => {
    config = mergeDeep({
        serviceName,
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
            info(msg) {
                console.log('INFO ', msg);
            },
            error(msg) {
                console.log('ERROR', msg);
            },
        },
    }, options);
    const tracer = initJaegerTracer(config, options);
    return tracer;
};
//# sourceMappingURL=tracer.js.map