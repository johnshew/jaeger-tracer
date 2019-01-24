import { Request, Response } from "express-serve-static-core";
import { Config, Options } from "./interfaces/jaeger-client-config.interface";
export declare let jaegarTracerMiddleWare: (serviceName: string, config: Config, options: Options) => (req: Request, res: Response, next: Function) => void;
