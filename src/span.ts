import { getFromCls } from './ClsManager';
import { constants } from "./constants";
import { SpanContext } from "./interfaces/jaegaer-span.interface";
import { Tracer } from "./interfaces/jaegar-tracer.interface";

/**
 * @description this is the main function which creates the spans in jarger-tracer 
 * @param name 
 * @param parentContext 
 * @param tracer 
 */
export let spanMaker = (name: string, parentContext: SpanContext | null, tracer: Tracer) => {
    // make a standalone span when no parent context came 
    if (!parentContext)
        return tracer.startSpan(name);

    // make the span with a parent context in any other case 
    return tracer.startSpan(name, {
        childOf: parentContext
    });
}

/**
 * @description ease out the initiation of a span with parent context
 * 
 * tracer: Tracer, parentContext: Span | SpanContext
 */
export let makeSpan = (name: string) => {
    // get tracer from the cls 
    let tracer: any = getFromCls(constants.tracer);

    // getting the parent context from the cls 
    let parentContext: any = getFromCls(constants.parentContext);

    return spanMaker(name, parentContext, tracer);
}

export let makeSpanWithParent = (name: string, parentContext: SpanContext) => {
    // get tracer from the cls 
    let tracer: any = getFromCls(constants.tracer);
    return spanMaker(name, parentContext, tracer);
}

/**
 * we need to make two functions
 * makeSpanWithParent which will take the parentContext,name and tracer by default
 * makeSpan which will just take the name and put the parent and tracer by default
 */

