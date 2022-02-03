const { verify, decode } = require('jsonwebtoken');
const { model } = require('mongoose');

const { Unauthorized, BadRequest } = require('../../errors');
const ConfigService = require('../../config/config.service');

class Authentication {
    constructor() {
        this.authenticate = this.#authenticateIt.bind(this);
    }

    #validateHeaderToken(token) {
        if (!token) {
            return;
        }

        const user = model('User').findOne({ mailToken: token });

        if (!user.isVerified) {
            throw new Unauthorized('Please confirm your email');
        }
    }

    #validateJWT(token) {
        const options = {
            key: ConfigService.getValue('JWT_KEY'),
            algorithm: ConfigService.getValue('JWT_ALGORITHM'),
        };

        const valid = verify(token, options.key, {
            algorithm: options.algorithm,
        });

        if (!valid) {
            throw new Unauthorized('Invalid credentials');
        }

        return decode(token);
    }

    /* eslint-disable consistent-return */
    async #authenticateIt(req, res, next) {
        this.#validateHeaderToken(req.headers.mailToken);

        const cookieToken = req.cookies.jwt;

        if (!cookieToken) {
            return next(new Unauthorized('Authentication is required'));
        }

        const token = this.#validateJWT(cookieToken);

        const user = await model('User')
            .findById(token.id)
            .select('-password -salt -__v -createdAt -updatedAt');

        if (!user.isVerified) {
            return next(new BadRequest('Please verify your email'));
        }

        req.user = user;

        next();
    }
    /* eslint-enable consistent-return */
}

module.exports = new Authentication();
