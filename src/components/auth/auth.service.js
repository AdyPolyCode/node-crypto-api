const UserService = require('../user/user.service');

const { Unauthorized } = require('../../errors');

const { MailService } = require('../../utils');

const { Factory, ServiceHandler } = require('../../helpers');

class AuthService extends ServiceHandler {
    constructor(...services) {
        super(services);
    }

    async register(username, email, password) {
        const user = await this.userService.create(username, email, password);

        const mailToken = user.createToken();

        user.mailToken = mailToken;

        user.save();

        const url = await this.mailService.mailIt(
            'mail-confirmation',
            mailToken,
            user.email
        );

        return { user, mailToken, url };
    }

    async login(email, password) {
        const user = await this.userService.findByEmail(email);

        const validPassword = user.comparePassword(password);

        if (!validPassword) {
            throw new Unauthorized('Invalid credentials');
        }

        const token = user.createJWT();

        return { user, token };
    }

    async changePassword(resetToken, password) {
        const user = await this.userService.findByResetToken(resetToken);

        const hash = user.hashPassword(password);

        user.password = hash;

        await user.save();
    }

    async confirmMail(mailToken) {
        const user = await this.userService.findByMailToken(mailToken);

        user.mail = undefined;
        user.isVerified = true;

        await user.save();
    }

    async forgotPassword(email) {
        const user = await this.userService.findByEmail(email);

        const resetToken = user.createToken();

        // ! use mailservice

        return { resetToken };
    }
}

module.exports = Factory.create(null, AuthService, UserService, MailService);
