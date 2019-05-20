import { Span } from './interfaces/jaegaer-span.interface';
import { Tracer } from './interfaces/jaegar-tracer.interface';
export declare let unirestWrapper: <T extends {
    [key: string]: any;
}>(unirest: T) => T;
export declare let requestWrapper: <T extends {
    [key: string]: any;
}>(request: T) => T;
export declare let getInjectionHeaders: (tracerObject?: Tracer | undefined, spanObject?: Span | undefined) => {
    'uber-trace-id': string;
};
