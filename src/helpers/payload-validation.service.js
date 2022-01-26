module.exports = class PayloadValidationService {
    static validate(schema) {
        return async (req, res, next) => {
            const { error } = await schema.validateAsync(req.body);

            if (error) {
                throw new Validation(error.message);
            }

            next();
        };
    }
};
