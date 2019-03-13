export interface Config {
    serviceName?: string;
    sampler?: {
        type?: "const" | "probabilistic" | "ratelimiting" | "remote" | String;
        param?: number;
        hostPort?: string;
        host?: string;
        port?: number;
        refreshIntervalMs?: number;
    };
    reporter?: {
        logSpans?: boolean;
        agentHost?: string;
        agentPort?: number;
        collectorEndpoint?: string;
        username?: string;
        password?: string;
        flushIntervalMs?: number;
    };
    throttler?: {
        host?: string;
        port?: number;
        refreshIntervalMs?: number;
    };
    shouldTrace?: () => Boolean | Boolean;
}
export interface Options {
    tags?: any;
    metrics?: any;
    logger?: any;
    filterData?: (data: any) => any;
}
