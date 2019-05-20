import { getFromJaegerNamespace, setInJaegerNamespace } from './clsManager';
import { Constants } from './constants';
import { SpanContext } from './interfaces/jaegaer-span.interface';
import { Tracer } from './interfaces/jaegar-tracer.interface';

/**
 * @description this is the main function which creates the spans in jarger-tracer
 * @param name
 * @param parentContext
 * @param tracer
 */
export let startSpan = (name: string, parentContext: SpanContext | null, tracer: Tracer) => {
    const span = null;

    // make a standalone span when no parent context came
    if (!parentContext || (parentContext && !parentContext.spanId)) {
        return tracer.startSpan(name);
    }

    setInJaegerNamespace(Constants.parentContext, parentContext);

    // make the span with a parent context in any other case
    return tracer.startSpan(name, {
        childOf: parentContext,
    });
};

/**
 * @description ease out the initiation of a span with parent context
 *
 * tracer: Tracer, parentContext: Span | SpanContext
 */
export let startSpanFromJaegerNamespace = (name: string, parentContext?: SpanContext) => {
    // get tracer from the cls
    const tracer: Tracer = getFromJaegerNamespace(Constants.tracer);

    // getting the parent context from the cls
    if (!parentContext) { parentContext = getFromJaegerNamespace(Constants.parentContext); }

    return startSpan(name, parentContext || null, tracer);
};

export let getMainSpan = () => {
    return getFromJaegerNamespace(Constants.mainSpan);
};
