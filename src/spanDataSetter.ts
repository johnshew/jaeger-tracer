import { Request, Response } from "express";
import { Span } from "./interfaces/jaegaer-span.interface";
const { Tags, FORMAT_HTTP_HEADERS } = require('opentracing');
import { json } from 'express-mung';

export let setReqSpanData = (req: Request, res: Response, span: Span) => {
    span.setTag(Tags.HTTP_URL, req.path);
    span.setTag(Tags.HTTP_METHOD, req.method);
    span.log({
        event: 'request',
        body: req.body,
        params: req.params,
        query: req.query,
    });
    return span;
}

export let setResSpanData = (req: Request, res: Response, span: Span): any => {

    // listening to the error 
    res.once('error', (err) => {
        span.log({
            event: 'response',
            status: 'error',
            error: err,
            // body: ''
        });
        span.finish();
    });

    res.once('finish', () => {
        mainInterceptorMW(req, res, () => { });
    });

    let responseInterceptor = (body: any, req: Request, res: Response) => {
        span.log({
            event: 'response',
            status: 'normal',
            body,
        });
        span.finish();

        return body;
    }

    let mainInterceptorMW = json(responseInterceptor);
}