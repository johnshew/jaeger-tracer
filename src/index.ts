import { getContext as gc } from './ClsManager';
import { initTracer as tracerFunc } from "./tracer";
import { makeSpan as ms, makeSpanWithParent as msp, spanMaker as sm } from './span';
import { jaegarTracerMiddleWare as jtm } from './middleware';
import { requestWrapper as rw, unirestWrapper as uw, getInjectHeaders as gih } from './requestWrappers';


/**
 * exporting the main tracer initiator function 
 */
export let initTracer = tracerFunc;

/**
 * exporting the spans
 */
export let makeSpan = ms;
export let makeSpanWithParent = msp;
export let spanMaker = sm;

/**
 * exporting the jaegar tracer middleware
 */
export let jaegarTracerMiddleware = jtm;


/**
 * exporting the cls context
 */
export let getContext = gc;

/**
 * exporting the wrappers
 */
export let unirestWrapper = uw;
export let requestWrapper = rw;
export let getInjectionHeaders = gih;