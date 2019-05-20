import * as http from 'http';
import * as https from 'https';
import { Tags } from 'opentracing';
import { Request, RequestHandler, Response } from 'restify';
import { Constants } from './constants';
import { httpModules } from './interfaces/httpModules.interface';
import { HttpPasserObject } from './interfaces/HttpPasserObject';
import { Span } from './interfaces/jaegaer-span.interface';
import { Tracer } from './interfaces/jaegar-tracer.interface';
import { getInjectionHeaders } from './requestWrappers';
const mung = require('express-mung');

export let setReqSpanData = (req: Request, res: Response, span: Span) => {
    span.setTag(Tags.HTTP_URL, req.path());
    span.setTag(Tags.HTTP_METHOD, req.method);
    span.setTag('Hostname', req.headers.host);
    span.log({
        event: 'request',
        body: req.body,
        params: req.params,
        query: req.query,
        headers: req.headers,
    });
    return span;
};

export let setResSpanData = (req: Request, res: Response, span: Span, filterFunction: any): RequestHandler => {

    // listening to the error
    res.once('error', function(this: Response, err: Error) {
        span.log({
            event: 'response',
            status: 'error',
            error: err,
            headers: this.getHeaders ? this.getHeaders() : this.headers || {},
            statusCode: this.statusCode || 'no status found',
        });
        span.finish();
    });

    let responseSpanLog: any = {
        event: 'response',
    };

    res.once('finish', function(this: Response) {
        // just finishing the span in case the mung did not work
        span.log(
            // applying the filter function which the user usually provide
            applyDataFilter(filterFunction, {
                ...responseSpanLog,
                headers: this.getHeaders ? this.getHeaders() : this.headers || {},
                statusCode: this.statusCode || 'no status found',
                statusMessage: this.statusMessage || 'no message found',
            }),
        );
        span.finish();
    });

    // do not forget the error case test
    const responseInterceptor = (body: any, req: Request, res: Response) => {
        responseSpanLog = {
            ...responseSpanLog,
            status: 'normal',
            body,
        };

        return body;
    };

    return mung.json(responseInterceptor);
};

// a flag to save that saving the original http requests function is saved
let isHttpRequestSaverExecuted = false;

/**
 * @description this is the function which override the actual http.request and https.request
 * to put the tracer headers in the request
 * @param param0
 * @param tracer
 * @param span
 */
export let putParentHeaderInOutgoingRequests = ({ http, https }: httpModules, tracer: Tracer, span: Span) => {
    const headers = getInjectionHeaders(tracer, span);

    // only works once
    if (!isHttpRequestSaverExecuted) {
        // save the original http and http request functions
        Constants.httpObjects = { http: http.request, https: https.request };

        // freezing the httpObject to be sure that they will not change anymore
        Object.freeze(Constants.httpObjects);

        // turn the flag to true means that the saving operation happened and dont call again ever
        isHttpRequestSaverExecuted = true;
    }

    const newRequestHttp = function(...args: any[]) {
        return Constants.httpObjects.http(...manipulateRequestArgs(args, headers));
    };

    const newRequestHttps = function(...args: any[]) {
        return Constants.httpObjects.https(...manipulateRequestArgs(args, headers));
    };

    http.request = newRequestHttp;
    https.request = newRequestHttps;
};

/**
 * @description function that manipulate the function args to make it ready for any outgoing
 * requests either an http or https request
 * @param args
 * @param newHeaders
 */
function manipulateRequestArgs(args: any[], newHeaders: any) {
    // getting our std object
    const stdObject: HttpPasserObject = args[2];

    // check if this is our std object
    const isThisStdObject = typeof stdObject === 'object' && stdObject.stdObject;

    // if this is our std object then get the headers from it
    if (isThisStdObject) {
        newHeaders = stdObject.headers;
    }

    // check if the std object does not exist then put it in the args
    if (!isThisStdObject) {
        // the second arg in the request func is a listner so we just fill it with an empty function
        // that do nothing
        args[1] = theNothingFunction;

        // then we put our arg as the third argument
        args[2] = { stdObject: true, headers: newHeaders };
    }

    // applying the headers on the request
    if (args[0] && args[0].headers) {
        args[0].headers = { ...args[0].headers || {}, ...newHeaders || {} };
    }

    return args;
}

/**
 * @description just an empty function used for passing function purposes
 */
const theNothingFunction = () => null;

/**
 * @description this is a function which apply filters on the logged data before they are logged
 */
async function applyDataFilter(filterFunction: Function, data: any) {
    if (!filterFunction) {
        return data;
    }

    // calling the data filter function
    const result = filterFunction(data);

    // if it returned a promise await it
    if (result.then) {
        return await result;
    }

    return result;
}
