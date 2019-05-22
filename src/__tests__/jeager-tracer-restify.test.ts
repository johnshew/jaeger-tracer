
import { default as fetch } from 'node-fetch';
import { default as restify } from 'restify';
import * as jaeger from '../index';
import { initTracer } from '../tracer';
import { Span } from 'opentracing';
import { promises } from 'fs';

describe('Restify Server', () => {

    // Note on testing jaeger with restify.
    // Normally one would sub out all the restify behavior - but much of what is getting checked is the aysnc and callback nature 
    // a web server with middleware that is inturn using other microsoft services.

    beforeAll(async (done) => {
        done();
    });

    test('simple jaeger', async (done) => {
        let tracer = initTracer('jaeger-tracer-restify', { reporter: { agentHost: 'localhost' } });
        let namespace = jaeger.getJaegerNamespace();
        namespace.run(async () => {
            namespace.set('tracer', tracer);
            let span = jaeger.startSpan('main-span', null, tracer);
            namespace.set('main-span', span);
            let server = restify.createServer();
            server.get('/', (req, res, next) => {
                res.json(200, {});
                res.end();
                span.log({
                    'status': 'request received'
                })
                next();
            });
            span.log({
                'status': 'server ready'
            })
            server.listen(8081);
            const response = await fetch('http://localhost:8081', {
                headers: { testing: "jaeger" }
            });
            expect(response.status).toBe(200);
            server.close(() => {
                done();
                span.finish();
            });
        });
    });

    test('sends headers', async (done) => {
        let tracer = initTracer('jaeger-tracer-restify', { reporter: { agentHost: 'localhost' } });
        let namespace = jaeger.getJaegerNamespace();
        namespace.run(async () => {
            namespace.set('tracer', tracer);
            let span = jaeger.startSpan('main-span', null, tracer);
            namespace.set('main-span', span);
            let server = restify.createServer();
            server.get('/', (req, res, next) => {
                console.log(req.headers);
                expect(req.header('uber-trace-id')).toBeDefined();
                res.json(200, {});
                res.end();
                span.log({
                    'status': 'request received'
                })
                next();
            });
            server.listen(8081);
            span.log({
                'status': 'server listening'
            })
            let newHeaders = jaeger.getInjectionHeaders();
            const response = await fetch('http://localhost:8081', {
                headers: { testing: "jaeger", ...newHeaders }
            });
            expect(response.status).toBe(200);
            server.close(() => {
                done();
                span.finish();
            });
        });
    });

    test('span across app, two more as children, one on the call and one of the request processing ', async (done) => {
        let tracer = initTracer('jaeger-tracer-restify', { reporter: { agentHost: 'localhost' } });
        let namespace = jaeger.getJaegerNamespace();
        let server1Promise = namespace.runAndReturn(async () => {
            namespace.set('tracer', tracer);
            let span = jaeger.startSpan('app1', null, tracer);
            namespace.set('app1', span);
            let server1 = restify.createServer();
            server1.get('/a', (req, res, next) => {
                console.log(req.headers);
                expect(req.header('uber-trace-id')).toBeDefined();
                res.json(200, {});
                res.end();
                span.log({
                    'status': 'request received'
                })
                next();
            });
            server1.listen(8081);
            span.log({
                'status': 'server listening'
            })
            span.finish();
            return server1;
        });
        let server2Promise = namespace.runAndReturn(async () => {
            namespace.set('tracer', tracer);
            let span = jaeger.startSpan('app2', null, tracer);
            namespace.set('app2', span);
            let server2 = restify.createServer();
            server2.get('/b', async (req, res, next) => {
                console.log(req.headers);
                let getSpan = jaeger.startSpanFromJaegerNamespace('get');
                expect(req.header('uber-trace-id')).toBeDefined();
                res.json(200, {});
                res.end();
                span.log({
                    'status': 'request received'
                })
                let newHeaders = jaeger.getInjectionHeaders();
                let callSpan = jaeger.startSpanFromJaegerNamespace('call')
                const response = await fetch('http://localhost:8081/a', {
                    headers: { testing: "jaeger", ...newHeaders }
                });
                expect(response.status).toBe(200);

                getSpan.finish();
                next();
            });
            server2.listen(8082);
            span.log({
                'status': 'server listening'
            })
            let newHeaders = jaeger.getInjectionHeaders();
            const response = await fetch('http://localhost:8082/b', {
                headers: { testing: "jaeger", ...newHeaders }
            });
            expect(response.status).toBe(200);
            span.finish();
            return server2;
        });
        let [server1, server2] = await Promise.all([server1Promise, server2Promise]);
        server1.close(() => {
            server2.close(() => {
                done();
            })
        })
    });

    afterAll(async (done) => {
        done();
    });
});
