import { getFromCls, saveToCls } from './ClsManager';
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
    let span = null;

    // make a standalone span when no parent context came 
    if (!parentContext || (parentContext && !parentContext.spanId))
        return tracer.startSpan(name);

    saveToCls(constants.parentContext, parentContext);

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
    let tracer: Tracer = getFromCls(constants.tracer);

    // getting the parent context from the cls 
    let parentContext: any = getFromCls(constants.parentContext);

    return spanMaker(name, parentContext, tracer);
}

export let makeSpanWithParent = (name: string, parentContext: SpanContext) => {
    // get tracer from the cls 
    let tracer: any = getFromCls(constants.tracer);
    return spanMaker(name, parentContext, tracer);
}

export let getMainSpan = () => {
    return getFromCls(constants.mainSpan);
}