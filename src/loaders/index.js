const expressLoader = require('./express.loader');
const databaseLoader = require('./database.loader.js');

const ConfigService = require('../config/config.service');
const { LoggerService } = require('../helpers');

module.exports = async (expressApp) => {
    try {
        const PORT = ConfigService.getValue('NODE_PORT');
        const URI = ConfigService.getValue('DEV_MONGO_URI');

        await databaseLoader(URI);

        const app = expressLoader(expressApp);

        app.listen(PORT, () => {
            LoggerService.info(`Server is listening at: ${PORT}`);
        });
    } catch (error) {
        LoggerService.error(error.message);

        process.exit(1);
    }
};
