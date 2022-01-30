const { Server } = require('socket.io');

module.exports = (appServer) => {
    const io = new Server(appServer);

    io.on('open', () => {});

    io.on('close', () => {});
};
