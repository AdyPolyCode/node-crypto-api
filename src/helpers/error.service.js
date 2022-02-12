const mongoose = require('mongoose');
const { MongoError } = require('mongoose/node_modules/mongodb/lib');

const Parser = require('./common/parser');
const LoggerService = require('./logger.service');

const { NotFound } = require('../errors');

class ErrorService extends Parser {
    #mongooseOptions;

    constructor() {
        super();

        this.#mongooseOptions = {
            MongoServerError: {
                statusCode: 400,
                message: 'Object already exists',
            },
            CastError: {
                statusCode: 400,
                message: 'Invalid object identifier',
            },
            ValidationError: {
                statusCode: 422,
                message: null,
            },
        };
    }

    parse(error) {
        super.parse(error);

        const result = { message: error.message, statusCode: error.statusCode };

        if (error instanceof mongoose.Error || error instanceof MongoError) {
            const err = this.#mongooseOptions[error.name];

            if (err.message) {
                result.message = err.message;
            }

            result.statusCode = err.statusCode;
        }

        return result;
    }

    handleException() {
        return (err, req, res, next) => {
            const { message, statusCode } = this.parse(err);

            LoggerService.error(err.message);

            res.status(statusCode || 500).json({
                message: message || 'Server error',
            });
        };
    }

    handleNotFound() {
        return (req, res, next) => {
            next(
                new NotFound(
                    `There is no page for requested endpoint - "${req.path}"`
                )
            );
        };
    }
}

module.exports = new ErrorService();
