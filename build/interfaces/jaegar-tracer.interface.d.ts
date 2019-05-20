import { Span, SpanContext, SpanOptions } from './jaegaer-span.interface';
export interface Tracer {
    startSpan: (name: string, options?: SpanOptions) => Span;
    inject: (spanContext: SpanContext | Span, format: string, carrier: any) => void;
    extract: (format: string, carrier: any) => SpanContext | null;
}
