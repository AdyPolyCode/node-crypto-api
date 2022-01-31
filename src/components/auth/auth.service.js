const UserService = require('../user/user.service');
const { MailService } = require('../../utils');
const { Unauthorized } = require('../../errors');

// TODO: finish proper implementation

class AuthService {
    constructor(userService, mailService) {
        this.userService = new userService();
        this.mailService = new mailService();
    }

    async register(username, email, password) {
        const user = await this.userService.create(username, email, password);

        const mailToken = user.createToken();

        user.mailToken = mailToken;

        user.save();

        // ! use mailservice

        return { user, mailToken };
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

module.exports = new AuthService(UserService, MailService);
