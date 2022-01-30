module.exports = class PayloadValidationService {
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
