const expressApp = require('express')();
const Client = require('socket.io-client');

const ConfigService = require('../src/config/config.service');

const expressLoader = require('../src/loaders/express.loader');
const websocketLoader = require('../src/loaders/web-socket.loader');

/* eslint-disable no-console */
describe('websocket connection between app and client', () => {
    let io;
    let client;

    beforeAll((done) => {
        const port = ConfigService.getValue('NODE_PORT');

        const appServer = expressLoader(expressApp).listen(port);
        io = websocketLoader(appServer);

        client = new Client(`http://localhost:${port}`);

        io.on('connection', (socket) => {
            console.log(`${socket.ip} has connected...`);
        });

        client.on('connect', done);
    });

    it('test basic message emit from server to client', () => {
        const message = 'Hello client';

        io.emit('message', message);

        client.on('message', (msg) => {
            console.log(msg);

            expect(msg).toBe(message);
        });
    });

    it('test basic client response to server message', () => {
        const message = 'Hello server';

        client.emit('response', message);

        io.on('response', (msg) => {
            console.log(msg);

            expect(msg).toBe(message);
        });
    });

    afterAll(() => {
        io.close();
        client.close();
    });
});
