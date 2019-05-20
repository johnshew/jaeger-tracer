import { SpanContext } from "./interfaces/jaegaer-span.interface";
import { Tracer } from "./interfaces/jaegar-tracer.interface";
export declare let startSpan: (name: string, parentContext: SpanContext | null, tracer: Tracer) => import("./interfaces/jaegaer-span.interface").Span;
export declare let startSpanFromContext: (name: string, parentContext?: SpanContext | undefined) => import("./interfaces/jaegaer-span.interface").Span;
export declare let getMainSpan: () => any;
