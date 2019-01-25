export declare let initTracer: (serviceName: string, config?: import("./interfaces/jaeger-client-config.interface").Config, options?: import("./interfaces/jaeger-client-config.interface").Options) => import("./interfaces/jaegar-tracer.interface").Tracer;
export declare let makeSpan: import("continuation-local-storage").Func<void>;
export declare let makeSpanWithParent: import("continuation-local-storage").Func<void>;
export declare let spanMaker: import("continuation-local-storage").Func<void>;
export declare let jaegarTracerMiddleware: import("continuation-local-storage").Func<void>;
export declare let getContext: import("continuation-local-storage").Func<void>;
export declare let unirestWrapper: import("continuation-local-storage").Func<void>;
export declare let requestWrapper: import("continuation-local-storage").Func<void>;
