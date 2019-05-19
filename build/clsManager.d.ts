import { Namespace } from 'continuation-local-storage';
import { Span } from './interfaces/jaegaer-span.interface';
import { Request, Response, Next, RequestHandler } from 'restify';
export declare let associateNMSWithReqBeforeGoingNext: (req: Request, res: Response, next: Next, mainSpan: Span, interceptorMiddleware: RequestHandler) => void;
export declare let saveToCls: (key: string, value: any) => any;
export declare let getFromCls: (key: string) => any;
export declare let getContext: () => Namespace;
