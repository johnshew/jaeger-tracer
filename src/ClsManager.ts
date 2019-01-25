import { createNamespace, Namespace, getNamespace } from 'cls-hooked';
import { constants } from './constants';
import { Span } from './interfaces/jaegaer-span.interface';
let session = createNamespace(constants.clsNamespace);

/**
 * @description this function is used before exactly going to the next route to put the span in the cls 
 * and actually make a cls which will be binded to the req , res 
 * @param req {Express.Request}
 * @param res {Express.Response}
 * @param next {Function}
 */
export let associateNMSWithReqBeforeGoingNext = session.bind(function (req: any, res: any, next: Function, mainSpan: Span, interceptorMiddleware: Function) {
    // before rerouting just inputing binding the req , and res to the cls to 
    // be used later to the spans
    session.bindEmitter(req);
    session.bindEmitter(res);

    // setting the main span to be accessible by all other function whereever we want them
    // and also this will always be binded to the existence to that req and res 
    saveToCls(constants.mainSpan, mainSpan);

    // just calling the response interceptor middleware to be applied on the response later on
    // this middleware should call next inside it automatically
    interceptorMiddleware(req, res, next);
});

export let saveToCls = session.bind((key: string, value: any) => {
    return session.set(key, value);
});

export let getFromCls = session.bind((key: string) => {
    return session.get(key);
});

export let getContext = session.bind((): Namespace => {
    return session;
});