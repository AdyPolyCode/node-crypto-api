const Joi = require('joi');

module.exports = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(4)
        .max(12)
        .required(),
    email: Joi.string()
        .email()
        .max(100)
        .required(),
    password: Joi.string()
        .alphanum()
        .min(8)
        .max(16)
        .required(),
});
