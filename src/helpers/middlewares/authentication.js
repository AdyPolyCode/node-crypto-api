const { verify, decode } = require('jsonwebtoken');
const { model } = require('mongoose');

const { Unauthorized } = require('../../errors');
const ConfigService = require('../../config/config.service');

class Authentication {
    constructor() {
        this.authenticate = this.authenticateIt.bind(this);
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

    async authenticateIt(req, res, next) {
        this.#validateHeaderToken(req.headers.mailToken);

        const cookieToken = req.cookies.jwt;

        if (!cookieToken) {
            throw new Unauthorized('Authentication is required');
        }

        const token = this.#validateJWT(cookieToken);

        req.userId = token.id;

        next();
    }
}

module.exports = new Authentication();
