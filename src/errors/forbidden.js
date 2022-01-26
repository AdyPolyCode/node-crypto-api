const { StatusCodes } = require('http-status-codes');

module.exports = class Forbidden extends Error {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.FORBIDDEN;
    }
};
