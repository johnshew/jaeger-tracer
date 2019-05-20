import { getFromJaegerNamespace } from './clsManager';
import { Constants } from './constants';
import { Span } from './interfaces/jaegaer-span.interface';
import { Tracer } from './interfaces/jaegar-tracer.interface';
const { FORMAT_HTTP_HEADERS } = require('opentracing');

/**
 * @description this is a function which will be used to inject headers in
 * unirest request and it should be put on each unirest require statement
 * @param unirest
 */
export let unirestWrapper = <T extends { [key: string]: any }>(unirest: T): T => {
    if (!unirest.request) {
        throw Error('This is not a unirest object please provide a unirest object');
    }

    // getting the request inside the unirest to manipulate its headers
    let baseRequest = unirest.request;

    // get the headers to be injected in the request
    const headers = getInjectionHeaders();

    // setting the default headers to be sent in all requests
    baseRequest = baseRequest.defaults({
        headers,
    });

    // setting the new request after we have set its new defaults
    (unirest as any).request = baseRequest;

    // at last returning the unirest object after the small manipulation in
    // its request library
    return unirest;
};

/**
 * @description this is the request/request wrapper library which
 * return a new request object that has injected headers by default embeded inside it
 * @param request
 */
export let requestWrapper = <T extends { [key: string]: any }>(request: T): T => {
    if (!request.defaults) {
        throw Error('This is not a request object please provide a request object');
    }

    // get the headers to be injected in the request
    const headers = getInjectionHeaders();

    // setting the default headers to be sent in all requests
    const baseRequest = request.defaults({
        headers,
    });

    // at last returning the request after applying the new default headers
    return baseRequest;
};

/**
 * @description this function just get the injection headers to be put in the request
 */
export let getInjectionHeaders = (tracerObject?: Tracer, spanObject?: Span): { 'uber-trace-id': string } => {
    // getting the main span from the cls
    const tracer: Tracer = tracerObject || getFromJaegerNamespace(Constants.tracer);
    const span: Span = spanObject || getFromJaegerNamespace(Constants.mainSpan);

    const headers: any = {};

    // setting the needed headers for injection of parent span
    tracer && span && tracer.inject(span, FORMAT_HTTP_HEADERS, headers);

    return headers;
};
