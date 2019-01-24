import { Span } from './interfaces/jaegaer-span.interface';
import { Request, Response } from 'express';
export declare let associateNMSWithReqBeforeGoingNext: (req: any, res: any, next: Function, mainSpan: Span, interceptorMiddleware: Function) => void;
export declare let initiateCLS: (req: Request, res: Response) => void;
export declare let saveToCls: (key: string, value: any) => any;
export declare let getFromCls: (key: string) => any;
export declare let getContext: () => import("continuation-local-storage").Namespace;
