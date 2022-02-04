const { createServer } = require('http');
const { Server } = require('socket.io');
const Client = require('socket.io-client');

/* eslint-disable no-console */
describe('base socket connection', () => {
    let io;
    let client;

    beforeAll((done) => {
        const httpServer = createServer();
        io = new Server(httpServer);

        const port = 3000;

        httpServer.listen(port, () => {
            client = new Client(`http://localhost:${port}`);

            io.on('connection', (socket) => {
                console.log(`${socket.id} has connected...`);
            });

            client.on('connect', done);
        });
    });

    it('test some base emit', () => {
        io.emit('welcome', 'Hello there');

        client.on('welcome', (msg) => {
            console.log(msg);

            expect(msg).toBe('Hello there');
        });
    });

    afterAll(() => {
        io.close();
        client.close();
    });
});
