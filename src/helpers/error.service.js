const mongoose = require('mongoose');

const Parser = require('./common/parser');
const logger = require('./logger.service');

const { NotFound } = require('../errors');

class ErrorService extends Parser {
    #mongooseOptions = {
        11000: {
            statusCode: 400,
            message: 'Object already exists',
        },
        CastError: {
            statusCode: 400,
            message: 'Invalid object identifier',
        },
    };

    #parse(error) {
        super.parse(error);

        if (error instanceof mongoose.Error) {
            error = this.#mongooseOptions[error.code || error.name];
        }

        return { message: error.message, statusCode: error.statusCode };
    }

    handleException(err, req, res, next) {
        const { message, statusCode } = this.#parse(err);

        logger.error(error.message);

        res.status(statusCode).json({
            message,
        });
    }

    handleNotFound(req, res, next) {
        next(
            new NotFound(
                `There is no page for requested endpoint - "${req.path}"`
            )
        );
    }
}

module.exports = new ErrorService();
