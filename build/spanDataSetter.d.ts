import { Request, Response } from "express";
import { Span } from "./interfaces/jaegaer-span.interface";
import { Tracer } from "./interfaces/jaegar-tracer.interface";
import { httpModules } from "./interfaces/httpModules.interface";
export declare let setReqSpanData: (req: Request, res: Response, span: Span) => Span;
export declare let setResSpanData: (req: Request, res: Response, span: Span) => any;
export declare let putParentHeaderInOutgoingRequests: ({ http, https }: httpModules, tracer: Tracer, span: Span) => void;
