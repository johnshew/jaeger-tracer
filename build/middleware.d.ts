import { Config, Options } from "./interfaces/jaeger-client-config.interface";
export declare let jaegarTracerMiddleWare: (serviceName: string, config?: Config | undefined, options?: Options | undefined) => import("continuation-local-storage").Func<void>;
