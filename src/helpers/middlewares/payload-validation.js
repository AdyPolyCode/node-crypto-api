const { Validation } = require('../../errors');

module.exports = class PayloadValidation {
    static validate(schema) {
        return async (req, res, next) => {
            try {
                await schema.validateAsync(req.body);

                next();
            } catch (error) {
                next(new Validation(error.message));
            }
        };
    }
};
