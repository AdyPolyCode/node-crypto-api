const mongoose = require('mongoose');

const { LoggerService } = require('../helpers');

module.exports = async (uri) => {
    const connection = await mongoose.connect(uri);

    LoggerService.info(`Connected to ${connection.connection.host}...`);
};
