import { Request, RequestHandler, Response } from 'restify';
import { httpModules } from './interfaces/httpModules.interface';
import { Span } from './interfaces/jaegaer-span.interface';
import { Tracer } from './interfaces/jaegar-tracer.interface';
export declare let setReqSpanData: (req: Request, res: Response, span: Span) => Span;
export declare let setResSpanData: (req: Request, res: Response, span: Span, filterFunction: any) => RequestHandler;
export declare let putParentHeaderInOutgoingRequests: ({ http, https }: httpModules, tracer: Tracer, span: Span) => void;
