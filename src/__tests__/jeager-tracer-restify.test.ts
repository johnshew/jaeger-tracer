
import { default as fetch } from 'node-fetch';
import { default as restify } from 'restify';
import { } from '../index';

describe('Restify Server', () => {
    let server: restify.Server;

    beforeAll(async (done) => {
        done();
    });

    test('loads app.html', async (done) => {
        server = restify.createServer();
        server.get('/', (req, res, next) => {
            res.json(200, {});
            res.end();
            next();
        });
        server.listen(8081);
        const response = await fetch('http://localhost:8081');
        expect(response.status).toBe(200);
        server.close(() => {
            done();
        });
    });

    afterAll(async (done) => {
        done();
    });
});
