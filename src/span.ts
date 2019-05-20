import { getFromCls, saveToCls } from './clsManager';
import { constants } from "./constants";
import { SpanContext } from "./interfaces/jaegaer-span.interface";
import { Tracer } from "./interfaces/jaegar-tracer.interface";

/**
 * @description this is the main function which creates the spans in jarger-tracer 
 * @param name 
 * @param parentContext 
 * @param tracer 
 */
export let startSpan = (name: string, parentContext: SpanContext | null, tracer: Tracer) => {
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
export let startSpanFromContext = (name: string, parentContext?: SpanContext) => {
    // get tracer from the cls 
    let tracer: Tracer = getFromCls(constants.tracer);

    // getting the parent context from the cls 
    if (!parentContext) parentContext = getFromCls(constants.parentContext);

    return startSpan(name, parentContext || null, tracer);
}

export let getMainSpan = () => {
    return getFromCls(constants.mainSpan);
}