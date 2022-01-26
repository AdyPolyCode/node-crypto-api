const { StatusCodes } = require('http-status-codes');

module.exports = class Validation extends Error {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.UNPROCESSABLE_ENTITY;
    }
};
