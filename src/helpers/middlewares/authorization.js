const { Forbidden } = require('../../errors');
const UserService = require('../../components/user/user.service');

/* eslint-disable consistent-return */
class Authorization {
    constructor(userService) {
        this.userService = new userService();

        this.roles = ['admin', 'user'];
    }

    #checkRole(role) {
        if (!role || !this.roles.includes(role)) {
            return new Forbidden('You are not allowed to do this');
        }
    }

    authorizeIt() {
        return async (req, res, next) => {
            const user = await this.userService.findById(req.userId);

            this.#checkRole(user.role);

            next();
        };
    }
}

module.exports = new Authorization(UserService);
