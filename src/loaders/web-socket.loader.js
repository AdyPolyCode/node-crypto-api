const { Server } = require('socket.io');

const WebSocketService = require('../utils/web-socket.service');

const { LoggerService } = require('../helpers');

module.exports = (appServer) => {
    const io = new Server(appServer);

    io.on('open', () => {
        LoggerService.info('Someone has connected...');
    });

    io.on('connection', (socket) => {
        WebSocketService.init(io, socket);
    });

    io.on('close', () => {
        LoggerService.info('Someone has left...');
    });

    return io;
};
