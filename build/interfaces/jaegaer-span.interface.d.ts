import { Tracer } from "./jaegar-tracer.interface";
export interface Span {
    context: () => SpanContext;
    tracer: () => Tracer;
    setOperationName: (name: string) => this;
    setBaggageItem: (key: string, value: string) => this;
    getBaggageItem: (key: string) => string | undefined;
    setTag: (key: string, value: any) => this;
    addTags: (keyValueMap: {
        [key: string]: any;
    }) => this;
    log: (keyValuePairs: {
        [key: string]: any;
    }, timestamp?: number) => this;
    finish: (finishTime?: number) => void;
}
export interface SpanOptions {
    childOf?: Span | SpanContext;
    references?: Reference[];
    tags?: {
        [key: string]: any;
    };
    startTime?: number;
}
export interface Reference {
    type: () => string;
    referencedContext: () => SpanContext;
}
export interface SpanContext {
    traceId: number;
    spanId: number;
    parentId: number;
    traceIdStr: string;
    spanIdStr: string;
    parentIdStr: string;
    flags: number;
    baggage: any;
    debugId: string;
    samplingFinalized: boolean;
    finalizeSampling: () => void;
    isSampled(): boolean;
    toString(): string;
    withBaggageItem(key: string, value: string): SpanContext;
}
