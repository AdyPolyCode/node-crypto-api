const UserService = require('../user/user.service');
const { MailService } = require('../../utils');
const { Unauthorized } = require('../../errors');

// TODO: after testing finish proper implementation
// TODO: implement jwt based auth

// TODO: stringify payload before mail

class AuthService {
    constructor(userService, mailService) {
        this.userService = new userService();
        this.mailService = new mailService();
    }

    async register(username, email, password) {
        const user = await this.userService.create(username, email, password);

        // ! use mailservice

        return user;
    }

    async login(email, password) {
        const user = await this.userService.findByEmail(email);

        const validPassword = user.comparePassword(password);

        if (!validPassword) {
            throw new Unauthorized('Invalid credentials');
        }

        // ! create jwt

        const token = null;

        return { user, token };
    }

    async changePassword(resetToken, password) {
        const user = await this.userService.findByResetToken(resetToken);

        const hash = user.hashPassword(password);

        user.password = hash;

        await user.save();

        return;
    }

    async confirmMail(mailToken) {
        const user = await this.userService.findByMailToken(mailToken);

        user.mail = undefined;
        user.isVerified = true;

        await user.save();
    }

    async forgotPassword(email) {
        const user = await this.userService.findByEmail(email);

        const token = user.createToken();

        // ! use mailservice
    }
}

module.exports = new AuthService(UserService, MailService);
