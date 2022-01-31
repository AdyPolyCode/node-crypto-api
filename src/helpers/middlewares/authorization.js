const { model } = require('mongoose');

const { Forbidden } = require('../../errors');

/* eslint-disable consistent-return */
class Authorization {
    constructor() {
        this.authorize = this.#authorizeIt.bind(this);
    }

    #checkRole(role) {
        const roles = ['admin', 'user'];

        if (!role || !roles.includes(role)) {
            return new Forbidden('You are not allowed to do this');
        }
    }

    async #authorizeIt(req, res, next) {
        const user = await model('User').findById(req.userId);

        this.#checkRole(user.role);

        next();
    }
}

module.exports = new Authorization();
