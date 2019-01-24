import { Request, Response } from "express";
import { Span } from "./interfaces/jaegaer-span.interface";
export declare let setReqSpanData: (req: Request, res: Response, span: Span) => Span;
export declare let setResSpanData: (req: Request, res: Response, span: Span) => any;
