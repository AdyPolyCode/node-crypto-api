const { StatusCodes } = require('http-status-codes');

module.exports = class Unauthorized extends Error {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.UNAUTHORIZED;
    }
};
