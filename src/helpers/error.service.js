const Parser = require('./common/parser');
const logger = require('./logger.service');

const { NotFound } = require('../errors');

// TODO: implement parse options for mongo

class ErrorService extends Parser {
    #mongooseOptions = {
        11000: {
            statusCode: 400,
            message: 'Record already exists - ',
        },
        CastError: {
            statusCode: 409,
            message: 'Record already exists - ',
        },
    };

    parse(...args) {
        super.parse(...args);

        const unit = args.length <= 1 ? args[0] : args;

        return error;
    }

    handleException(err, req, res, next) {
        const error = { ...err };
        error.message = err.message;

        logger.error(error.message);
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
