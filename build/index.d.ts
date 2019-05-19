export declare let initTracer: (serviceName: string, config?: import("./interfaces/jaeger-client-config.interface").Config, options?: import("./interfaces/jaeger-client-config.interface").Options) => import("./tracer").Tracer;
export declare let makeSpan: (name: string) => import("./interfaces/jaegaer-span.interface").Span;
export declare let makeSpanWithParent: (name: string, parentContext: import("./interfaces/jaegaer-span.interface").SpanContext) => import("./interfaces/jaegaer-span.interface").Span;
export declare let spanMaker: (name: string, parentContext: import("./interfaces/jaegaer-span.interface").SpanContext | null, tracer: import("./tracer").Tracer) => import("./interfaces/jaegaer-span.interface").Span;
export declare let jaegarTracerMiddleware: (httpModules: import("./interfaces/httpModules.interface").httpModules, serviceName: string, config?: import("./interfaces/jaeger-client-config.interface").Config, options?: import("./interfaces/jaeger-client-config.interface").Options) => (req: import("restify").Request, res: import("restify").Response, next: import("restify").Next) => void;
export declare let middlewareTracer: import("./tracer").Tracer;
export declare let getContext: () => import("continuation-local-storage").Namespace;
export declare let unirestWrapper: <T extends {
    [key: string]: any;
}>(unirest: T) => T;
export declare let requestWrapper: <T extends {
    [key: string]: any;
}>(request: T) => T;
export declare let getInjectionHeaders: (tracerObject?: import("./tracer").Tracer | undefined, spanObject?: import("./interfaces/jaegaer-span.interface").Span | undefined) => {
    'uber-trace-id': string;
};
