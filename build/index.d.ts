export declare let initTracer: (serviceName: string, config?: import("./interfaces/jaeger-client-config.interface").Config, options?: import("./interfaces/jaeger-client-config.interface").Options) => import("./interfaces/jaegar-tracer.interface").Tracer;
export declare let makeSpan: (name: string) => import("./interfaces/jaegaer-span.interface").Span;
export declare let makeSpanWithParent: (name: string, parentContext: import("./interfaces/jaegaer-span.interface").SpanContext) => import("./interfaces/jaegaer-span.interface").Span;
export declare let spanMaker: (name: string, parentContext: import("./interfaces/jaegaer-span.interface").SpanContext | null, tracer: import("./interfaces/jaegar-tracer.interface").Tracer) => import("./interfaces/jaegaer-span.interface").Span;
export declare let jaegarTracerMiddleware: (serviceName: string, config?: import("./interfaces/jaeger-client-config.interface").Config | undefined, options?: import("./interfaces/jaeger-client-config.interface").Options | undefined) => import("continuation-local-storage").Func<void>;
export declare let getContext: () => import("continuation-local-storage").Namespace;
export declare let unirestWrapper: (unirest: any) => any;
export declare let requestWrapper: (request: any) => any;
