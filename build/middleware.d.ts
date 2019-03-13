import { Request, Response } from "express-serve-static-core";
import { Config, Options } from "./interfaces/jaeger-client-config.interface";
import { httpModules } from './interfaces/httpModules.interface';
export declare let jaegarTracerMiddleWare: (httpModules: httpModules, serviceName: string, config?: Config, options?: Options) => (req: Request, res: Response, next: Function) => void;
