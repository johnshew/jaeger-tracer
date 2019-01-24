export interface Config {

    /**
     * @description service name to use in tracing
     */
    serviceName?: string;

    /**
     * @description sampler configuration
     */
    sampler?: {
        type?: "const" | "probabilistic" | "ratelimiting" | "remote" | String;
        param?: number;
        hostPort?: string;
        host?: string;
        port?: number;
        refreshIntervalMs?: number;
    },

    /**
     * @description reporter configuration
     */
    reporter?: {
        logSpans?: boolean;
        agentHost?: string;
        agentPort?: number;
        collectorEndpoint?: string;
        username?: string;
        password?: string;
        flushIntervalMs?: number;
    },

    /**
     * @description throttler configuration
     */
    throttler?: {
        host?: string;
        port?: number;
        refreshIntervalMs?: number;
    }
};

export interface Options {
    tags?: any;
    metrics?: any;
    logger?: any;
}