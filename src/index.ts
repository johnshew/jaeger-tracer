import { createNamespace } from 'continuation-local-storage';
let session = createNamespace(constants.clsNamespace);

import { initTracer as tracerFunc } from "./tracer";
import { makeSpan as ms, makeSpanWithParent as msp, spanMaker as sm } from './span';
import { jaegarTracerMiddleWare as jtm } from './middleware';
import { getContext as gc } from './ClsManager';
import { requestWrapper as rw, unirestWrapper as uw } from './requestWrappers';
import { constants } from './constants';

/**
 * exporting the main tracer initiator function 
 */
export let initTracer = tracerFunc;

/**
 * exporting the spans
 */
export let makeSpan = session.bind(ms);
export let makeSpanWithParent = session.bind(msp);
export let spanMaker = session.bind(sm);

/**
 * exporting the jaegar tracer middleware
 */
export let jaegarTracerMiddleware = session.bind(jtm);


/**
 * exporting the cls context
 */
export let getContext = session.bind(gc);


/**
 * exporting the wrappers
 */
export let unirestWrapper = session.bind(uw);
export let requestWrapper = session.bind(rw);