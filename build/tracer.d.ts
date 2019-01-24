import { Tracer } from "./interfaces/jaegar-tracer.interface";
import { Config, Options } from "./interfaces/jaeger-client-config.interface";
export declare let initTracer: (serviceName: string, config?: Config, options?: Options) => Tracer;
