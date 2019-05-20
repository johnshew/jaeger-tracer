import { Next, Request, Response } from 'restify';
import { httpModules } from './interfaces/httpModules.interface';
import { Config, Options } from './interfaces/jaeger-client-config.interface';
import { Tracer } from './tracer';
export declare const session: import("continuation-local-storage").Namespace;
export declare let tracer: Tracer;
export declare let jaegarTracerMiddleWare: (httpModules: httpModules, serviceName: string, config?: Config, options?: Options) => (req: Request, res: Response, next: Next) => void;
