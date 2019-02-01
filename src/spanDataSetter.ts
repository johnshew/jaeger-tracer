import { Request, Response } from "express";
import { json } from 'express-mung';
import { Span } from "./interfaces/jaegaer-span.interface";
const { Tags } = require('opentracing');
import * as http from 'http';
import * as https from 'https';
import { Tracer } from "./interfaces/jaegar-tracer.interface";
import { getInjectHeaders } from "./requestWrappers";
import { httpModules } from "./interfaces/httpModules.interface";

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
    res.once('error', function (this: Response | any, err: Error) {
        span.log({
            event: 'response',
            status: 'error',
            error: err,
            headers: this.getHeaders ? this.getHeaders() : this.headers || {},
            statusCode: this.statusCode || 'no status found'
        });
        span.finish();
    });

    let responseSpanLog: any = {
        event: 'response',
    };

    res.once('finish', function (this: Response | any) {
        // just finishing the span in case the mung did not work
        span.log({
            ...responseSpanLog,
            headers: this.getHeaders ? this.getHeaders() : this.headers || {},
            statusCode: this.statusCode || 'no status found',
            statusMessage: this.statusMessage || 'no message found'
        });
        span.finish();
    });

    // do not forget the error case test
    let responseInterceptor = (body: any, req: Request, res: Response) => {
        responseSpanLog = {
            ...responseSpanLog,
            status: 'normal',
            body,
        };

        return body;
    }

    return json(responseInterceptor, { mungError: true });
}

export let putParentHeaderInOutgoingRequests = ({ http, https }: httpModules, tracer: Tracer, span: Span) => {
    let headers = getInjectHeaders(tracer, span);

    let oldHttpRequest: any = http.request;
    let oldHttpsRequest: any = https.request;

    let newRequestHttp = function (...args: any[]) {
        if (args[0] && args[0]['headers'])
            args[0]['headers'] = { ...args[0]['headers'] || {}, ...headers || {} };

        return oldHttpRequest(...args);
    }

    let newRequestHttps = function (...args: any[]) {
        if (args[0] && args[0]['headers'])
            args[0]['headers'] = { ...args[0]['headers'] || {}, ...headers || {} };

        return oldHttpsRequest(...args);
    }

    http.request = newRequestHttp;
    https.request = newRequestHttps;
} 
