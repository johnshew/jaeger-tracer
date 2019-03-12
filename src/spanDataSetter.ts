import { Request, Response } from "express";
import { json } from 'express-mung';
import { Span } from "./interfaces/jaegaer-span.interface";
const { Tags } = require('opentracing');
import * as http from 'http';
import * as https from 'https';
import { Tracer } from "./interfaces/jaegar-tracer.interface";
import { getInjectHeaders } from "./requestWrappers";
import { httpModules } from "./interfaces/httpModules.interface";
import { HttpPasserObject } from "./interfaces/HttpPasserObject";
import { constants } from "./constants";

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

// a flag to save that saving the original http requests function is saved
let isHttpRequestSaverExecuted = false;

export let putParentHeaderInOutgoingRequests = ({ http, https }: httpModules, tracer: Tracer, span: Span) => {
    let headers = getInjectHeaders(tracer, span);

    // only works once
    if (!isHttpRequestSaverExecuted) {
        // save the original http and http request functions
        constants.httpObjects = { http: http.request, https: https.request };

        // freezing the httpObject to be sure that they will not change anymore
        Object.freeze(constants.httpObjects);

        // turn the flag to true means that the saving operation happened and dont call again ever
        isHttpRequestSaverExecuted = true;
    }

    let newRequestHttp = function (...args: any[]) {
        return constants.httpObjects.http(...manipulateRequestArgs(args, headers));
    }

    let newRequestHttps = function (...args: any[]) {
        return constants.httpObjects.https(...manipulateRequestArgs(args, headers));
    }

    http.request = newRequestHttp;
    https.request = newRequestHttps;
}

/**
 * @description function that manipulate the function args to make it ready for any outgoing 
 * requests either an http or https request 
 * @param args 
 * @param newHeaders 
 */
function manipulateRequestArgs(args: any[], newHeaders: any) {
    // getting our std object
    let stdObject: HttpPasserObject = args[2];

    // check if this is our std object
    let isThisStdObject = typeof stdObject === 'object' && stdObject.stdObject;

    // if this is our std object then get the headers from it
    if (isThisStdObject)
        newHeaders = stdObject.headers;

    // check if the std object does not exist then put it in the args
    if (!isThisStdObject) {
        // the second arg in the request func is a listner so we just fill it with an empty function
        // that do nothing
        args[1] = theNothingFunction;

        // then we put our arg as the third argument
        args[2] = { stdObject: true, headers: newHeaders };
    }

    // applying the headers on the request 
    if (args[0] && args[0]['headers'])
        args[0]['headers'] = { ...args[0]['headers'] || {}, ...newHeaders || {} };

    return args;
}

let theNothingFunction = () => null;