import { Request, Response } from "express";
import { Span } from "./interfaces/jaegaer-span.interface";
const { Tags, FORMAT_HTTP_HEADERS } = require('opentracing');
let interceptor = require('express-interceptor');

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

    let responseInterceptor = (body: any, send: Function) => {
        span.log({
            event: 'response',
            status: 'normal',
            body,
        });
        span.finish();

        return send(body);
    }

    return interceptor((req: Request, res: Response) => {
        return {
            // just return true means that any kind of response need to be intercepted
            isInterceptable: () => true,
            // this is the function that will happen on response interception
            intercept: responseInterceptor
        };
    });
}