import { createNamespace, getNamespace, Namespace } from 'continuation-local-storage';
import { Next, Request, RequestHandler, Response } from 'restify';
import { Constants } from './constants';
import { Span } from './interfaces/jaegaer-span.interface';

const session = createNamespace(Constants.jeagerClsNamespace);

/**
 * @description this function is used before exactly going to the next route to put the span in the cls
 * and actually make a cls which will be binded to the req , res
 * @param req {Express.Request}
 * @param res {Express.Response}
 * @param next {Function}
 */
export let associateNMSWithReqBeforeGoingNext = (req: Request, res: Response, next: Next, mainSpan: Span, interceptorMiddleware: RequestHandler) => {
    // before rerouting just inputing binding the req , and res to the cls to
    // be used later to the spans
    session.bindEmitter(req);
    session.bindEmitter(res);

    // setting the main span to be accessible by all other function whereever we want them
    // and also this will always be binded to the existence to that req and res
    setInJaegerNamespace(Constants.mainSpan, mainSpan);

    // just calling the response interceptor middleware to be applied on the response later on
    // this middleware should call next inside it automatically
    session.run(() => {
        interceptorMiddleware(req, res, next);
    });
};

export let setInJaegerNamespace = (key: string, value: any) => {
    return session.set(key, value);
};

export let getFromJaegerNamespace = (key: string) => {
    return session.get(key);
};

export let getJaegerNamespace = (): Namespace => {
    return session;
};
