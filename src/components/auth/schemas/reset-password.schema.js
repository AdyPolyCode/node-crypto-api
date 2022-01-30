const Joi = require('joi');

module.exports = Joi.object({
    password1: Joi.string()
        .alphanum()
        .min(8)
        .max(16)
        .required(),
    password2: Joi.valid(
        Joi.ref('password1')
    ).required(),
});
