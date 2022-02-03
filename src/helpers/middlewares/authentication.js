const { verify, decode } = require('jsonwebtoken');

const { Unauthorized, BadRequest } = require('../../errors');
const ConfigService = require('../../config/config.service');
const UserService = require('../../components/user/user.service');

class Authentication {
    constructor(userService) {
        this.userService = new userService();
        this.authenticate = this.#authenticateIt.bind(this);
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
        try {
            const cookieToken = req.cookies.jwt;

            if (!cookieToken) {
                return next(new Unauthorized('Authentication is required'));
            }

            const token = this.#validateJWT(cookieToken);

            const user = await this.userService.findById(token.id);

            if (!user.isVerified) {
                return next(new BadRequest('Please confirm your email'));
            }

            req.userId = token.id;

            next();
        } catch (error) {
            next(error);
        }
    }
    /* eslint-enable consistent-return */
}

module.exports = new Authentication(UserService);
