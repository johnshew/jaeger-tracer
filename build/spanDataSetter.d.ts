import { Request, Response } from "express";
import { Span } from "./interfaces/jaegaer-span.interface";
import { Tracer } from "./interfaces/jaegar-tracer.interface";
export declare let setReqSpanData: (req: Request, res: Response, span: Span) => Span;
export declare let setResSpanData: (req: Request, res: Response, span: Span) => any;
export declare let putParentHeaderInOutgoingRequests: (http: any, tracer: Tracer, span: Span) => void;
