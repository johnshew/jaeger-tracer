import { getNamespace } from 'continuation-local-storage';
import { FORMAT_HTTP_HEADERS } from 'opentracing';
import { Next, Request, RequestHandler, Response } from 'restify';
import { associateNMSWithReqBeforeGoingNext, getFromJaegerNamespace, setInJaegerNamespace } from './clsManager';
import { Constants } from './constants';
import { httpModules } from './interfaces/httpModules.interface';
import { Config, Options } from './interfaces/jaeger-client-config.interface';
import { startSpan } from './span';
import { putParentHeaderInOutgoingRequests, setReqSpanData, setResSpanData } from './spanDataSetter';
import { initTracer, Tracer } from './tracer';

export const session = getNamespace(Constants.jeagerClsNamespace);
export let tracer: Tracer;

/**
 * @description this is the function that returns the main middleware
 * @param serviceName
 */
export let jaegarTracerMiddleWare = function(httpModules: httpModules, serviceName: string, config: Config = {}, options: Options = {}) {

    // if we should not trace then just return an empty middleware
    if (!shouldTrace(config.shouldTrace)) {
        return (req: any, res: any, next: Function) => next();
    }

    // initiating the tracer outside the middleware so we dont have to initiate it everytime a request comes
    tracer = initTracer(serviceName, config, options);

    /**
     * @description this is an express middleware to be used to instrument an application
     * requests and responses
     * @param req
     * @param res
     * @param next
     */
    const middleware = (req: Request, res: Response, next: Next) => {
        session.run(() => {
            // saving the tracer in the cls after its initialization
            setInJaegerNamespace(Constants.tracer, tracer);

            // extract the parent context from the tracer
            const parentSpanContext = tracer.extract(FORMAT_HTTP_HEADERS, req.headers);
            const mainReqSpan = startSpan(req.path(), parentSpanContext, tracer);

            // setting span data on the request
            setReqSpanData(req, res, mainReqSpan);

            // setting span data on the response and ending the span when the response comes
            const responseInterceptor = setResSpanData(req, res, mainReqSpan, options.filterData);

            // monkey patch http and https modules to put the headers inside
            putParentHeaderInOutgoingRequests(httpModules, tracer, mainReqSpan);

            // calling the cls manager and after that running the response interceptor inside it
            associateNMSWithReqBeforeGoingNext(req, res, next, mainReqSpan, responseInterceptor);
        });
    };

    return middleware;
};

function shouldTrace(isTraceWorking?: () => Boolean | Boolean) {
    // by default we should trace
    if (isTraceWorking === undefined) {
        return true;
    }

    const type = typeof isTraceWorking;

    if (type === 'boolean') {
        return isTraceWorking;
    }

    if (type === 'function') {
        return isTraceWorking();
    }

    throw Error('shouldTrace value should of type "boolean" or "function" that returns a boolean');
}

/**
 * when the request comes we will initiate a tracer -- checked
 * then initiate the main span and dont forget that we need to extract any context existing the req -- checked
 * then export some functions which include the tracer inside it -- checked
 * and some other functions that initiates span but automaically make the main span as the parent span -- checked
 * also we will export the normal start span function to let the user have the freedom to do anything he want to do --
 */

/**
 * put the main request span inside any span initiated
 */
