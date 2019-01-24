import { SpanContext } from "./interfaces/jaegaer-span.interface";
import { Tracer } from "./interfaces/jaegar-tracer.interface";
export declare let spanMaker: (name: string, parentContext: SpanContext | null, tracer: Tracer) => import("./interfaces/jaegaer-span.interface").Span;
export declare let makeSpan: (name: string) => import("./interfaces/jaegaer-span.interface").Span;
export declare let makeSpanWithParent: (name: string, parentContext: SpanContext) => import("./interfaces/jaegaer-span.interface").Span;
