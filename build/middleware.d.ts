import { Request, Response, Next } from "restify";
import { Config, Options } from "./interfaces/jaeger-client-config.interface";
import { Tracer } from './tracer';
import { httpModules } from './interfaces/httpModules.interface';
export declare const session: import("continuation-local-storage").Namespace;
export declare var tracer: Tracer;
export declare let jaegarTracerMiddleWare: (httpModules: httpModules, serviceName: string, config?: Config, options?: Options) => (req: Request, res: Response, next: Next) => void;
