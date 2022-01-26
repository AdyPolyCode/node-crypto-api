const asyncHandler = require('express-async-handler');
const AuthService = require('./auth.service');

// TODO: after testing finish proper implementation

module.exports = class AuthController {
    static login() {
        return asyncHandler(async (req, res) => {
            const { email, password } = req.body;

            const r = await AuthService.login(email, password);

            res.json({
                message: 'success',
                data: r,
            });
        });
    }

    static register() {
        return asyncHandler(async (req, res) => {
            console.log(req.body);
            const { username, email, password } = req.body;

            const r = await AuthService.register(username, email, password);

            res.json({
                message: 'success',
                data: r,
            });
        });
    }

    static logout() {
        return asyncHandler(async (req, res) => {
            const r = await AuthService.logout('tokenString');

            res.json({
                message: 'success',
                data: r,
            });
        });
    }

    static forgotPassword() {
        return asyncHandler(async (req, res) => {
            const { email } = req.body;

            const r = await AuthService.forgotPassword(email);

            res.json({
                message: 'success',
                data: r,
            });
        });
    }

    static resetPassword() {
        return asyncHandler(async (req, res) => {
            const { password } = req.body;

            const r = await AuthService.changePassword('resetToken', password);

            res.json({
                message: 'success',
                data: r,
            });
        });
    }

    static confirmMail() {
        return asyncHandler(async (req, res) => {
            const r = await AuthService.confirmMail('mailToken');

            res.json({
                message: 'success',
                data: r,
            });
        });
    }
};
