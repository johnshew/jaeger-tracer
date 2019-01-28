export declare let initTracer: (serviceName: string, config?: import("./interfaces/jaeger-client-config.interface").Config, options?: import("./interfaces/jaeger-client-config.interface").Options) => import("./interfaces/jaegar-tracer.interface").Tracer;
export declare let makeSpan: (name: string) => import("./interfaces/jaegaer-span.interface").Span;
export declare let makeSpanWithParent: (name: string, parentContext: import("./interfaces/jaegaer-span.interface").SpanContext) => import("./interfaces/jaegaer-span.interface").Span;
export declare let spanMaker: (name: string, parentContext: import("./interfaces/jaegaer-span.interface").SpanContext | null, tracer: import("./interfaces/jaegar-tracer.interface").Tracer) => import("./interfaces/jaegaer-span.interface").Span;
export declare let jaegarTracerMiddleware: (serviceName: string, config?: import("./interfaces/jaeger-client-config.interface").Config | undefined, options?: import("./interfaces/jaeger-client-config.interface").Options | undefined) => (req: import("express-serve-static-core").Request, res: import("express-serve-static-core").Response, next: Function) => void;
export declare let getContext: () => import("continuation-local-storage").Namespace;
export declare let unirestWrapper: <T extends {
    [key: string]: any;
}>(unirest: T) => T;
export declare let requestWrapper: <T extends {
    [key: string]: any;
}>(request: T) => T;
export declare let getInjectionHeaders: () => {
    'uber-trace-id': string;
};
