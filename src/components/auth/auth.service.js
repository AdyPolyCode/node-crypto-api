const UserService = require('../user/user.service');
const { MailService, MessageQueueService } = require('../../utils');

// TODO: after testing finish proper implementation
// TODO: implement jwt based auth

module.exports = class AuthService {
    static async register(username, email, password) {
        return { username, email, password };
    }

    static async login(email, password) {
        return { email, password };
    }

    static async logout(tokenString) {
        return { tokenString };
    }

    static async changePassword(resetToken, password) {
        return { resetToken, password };
    }

    static async confirmMail(mailToken) {
        return { mailToken };
    }

    static async forgotPassword(email) {
        return { email };
    }
};
