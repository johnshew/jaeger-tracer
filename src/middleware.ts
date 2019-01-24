import { Request, Response } from "express-serve-static-core";
import { associateNMSWithReqBeforeGoingNext, saveToCls, getContext } from "./ClsManager";
import { Config, Options } from "./interfaces/jaeger-client-config.interface";
import { spanMaker } from "./span";
import { setReqSpanData, setResSpanData } from "./spanDataSetter";
import { initTracer } from './tracer';
import { constants } from "./constants";
import { requestWrapper } from ".";
import { unirestWrapper } from "./requestWrappers";
let { FORMAT_HTTP_HEADERS } = require('opentracing');


/**
 * @description this is the function that returns the main middleware 
 * @param serviceName 
 */
export let jaegarTracerMiddleWare = (serviceName: string, config?: Config, options?: Options) => {

    // initiating the tracer outside the middleware so we dont have to initiate it everytime a request comes
    let tracer = initTracer(serviceName, config, options);

    // initiating the cls
    let session = getContext();
    session.createContext();

    /**
     * @description this is an express middleware to be used to instrument an application 
     * requests and responses 
     * @param req 
     * @param res 
     * @param next 
     */
    let middleware = (req: Request, res: Response, next: Function) => {
        // saving the tracer in the cls after its initialization
        saveToCls(constants.tracer, tracer);

        // extract the parent context from the tracer
        let parentSpanContext = tracer.extract(FORMAT_HTTP_HEADERS, req.headers);
        let mainReqSpan = spanMaker(req.path, parentSpanContext, tracer);

        // setting span data on the request
        setReqSpanData(req, res, mainReqSpan);

        // setting span data on the response and ending the span when the response comes
        let responseInterceptor = setResSpanData(req, res, mainReqSpan);

        // calling the cls manager and after that running the response interceptor inside it 
        associateNMSWithReqBeforeGoingNext(req, res, next, mainReqSpan, responseInterceptor);
    };

    let result = session.bind(middleware);
    console.log('result', result);
    return result;
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