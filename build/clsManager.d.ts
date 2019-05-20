import { Namespace } from 'continuation-local-storage';
import { Next, Request, RequestHandler, Response } from 'restify';
import { Span } from './interfaces/jaegaer-span.interface';
export declare let associateNMSWithReqBeforeGoingNext: (req: Request, res: Response, next: Next, mainSpan: Span, interceptorMiddleware: RequestHandler) => void;
export declare let setInJaegerNamespace: (key: string, value: any) => any;
export declare let getFromJaegerNamespace: (key: string) => any;
export declare let getJaegerNamespace: () => Namespace;
