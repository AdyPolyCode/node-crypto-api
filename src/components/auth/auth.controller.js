const asyncHandler = require('express-async-handler');
const AuthService = require('./auth.service');

// TODO: finish proper implementation

module.exports = class AuthController {
    static login() {
        return asyncHandler(async (req, res) => {
            const { email, password } = req.body;

            const { user, token } = await AuthService.login(email, password);

            res.cookie('jwt', token, { httpOnly: true, secure: false }).json({
                message: 'success',
                data: {
                    email: user.email,
                },
            });
        });
    }

    static register() {
        return asyncHandler(async (req, res) => {
            const { username, email, password } = req.body;

            const { user, mailToken } = await AuthService.register(
                username,
                email,
                password
            );

            res.setHeader('mailToken', mailToken);

            res.status(201).json({
                message: 'success',
                data: {
                    email: user.email,
                    url: '',
                },
            });
        });
    }

    static logout() {
        return asyncHandler(async (req, res) => {
            res.clearCookie('jwt', { httpOnly: true, secure: false }).json({
                message: 'success',
            });
            res.json({
                message: 'success',
            });
        });
    }

    static forgotPassword() {
        return asyncHandler(async (req, res) => {
            const { email } = req.body;

            const { resetToken } = await AuthService.forgotPassword(email);

            res.setHeader('resetToken', resetToken);

            res.json({
                message: 'success',
            });
        });
    }

    static resetPassword() {
        return asyncHandler(async (req, res) => {
            const { password } = req.body;
            const { resetToken } = req.params;

            await AuthService.changePassword(resetToken, password);

            res.json({
                message: 'success',
            });
        });
    }

    static confirmMail() {
        return asyncHandler(async (req, res) => {
            await AuthService.confirmMail('mailToken');

            res.json({
                message: 'success',
            });
        });
    }
};
