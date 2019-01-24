import { Request, Response } from "express";
import { json } from 'express-mung';
import { Span } from "./interfaces/jaegaer-span.interface";
const { Tags } = require('opentracing');

export let setReqSpanData = (req: Request, res: Response, span: Span) => {
    span.setTag(Tags.HTTP_URL, req.path);
    span.setTag(Tags.HTTP_METHOD, req.method);
    span.setTag('Hostname', req.hostname);
    span.log({
        event: 'request',
        body: req.body,
        params: req.params,
        query: req.query,
        headers: req.headers
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
            headers: res.getHeaders()
        });
        span.finish();
    });

    res.once('finish', () => {
        // just finishing the span in case the mung did not work
        span.finish();
    });

    // do not forget the error case test
    let responseInterceptor = (body: any, req: Request, res: Response) => {
        span.log({
            event: 'response',
            status: 'normal',
            statusCode: res.statusCode,
            body,
            headers: res.getHeaders(),
        });

        return body;
    }

    return json(responseInterceptor);
}