import { Request, Response, Next } from "restify";
import { Config, Options } from "./interfaces/jaeger-client-config.interface";
import { httpModules } from './interfaces/httpModules.interface';
export declare let jaegarTracerMiddleWare: (httpModules: httpModules, serviceName: string, config?: Config, options?: Options) => (req: Request, res: Response, next: Next) => void;
