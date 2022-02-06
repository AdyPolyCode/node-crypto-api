const expressLoader = require('./express.loader');
const databaseLoader = require('./database.loader.js');

const ConfigService = require('../config/config.service');
const { LoggerService } = require('../helpers');
const webSocketLoader = require('./web-socket.loader');

module.exports = async (expressApp) => {
    try {
        const PORT = ConfigService.getValue('NODE_PORT');
        const URI = ConfigService.getValue('DEV_MONGO_URI');

        await databaseLoader(URI);

        const app = expressLoader(expressApp);

        const server = app.listen(PORT, () => {
            LoggerService.info(`Server is listening at: ${PORT}`);
        });

        webSocketLoader(server);
    } catch (error) {
        LoggerService.error(error.message);

        process.exit(1);
    }
};
