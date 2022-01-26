const { StatusCodes } = require('http-status-codes');

module.exports = class NotFound extends Error {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.NOT_FOUND;
    }
};
