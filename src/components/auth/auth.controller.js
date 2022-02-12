const asyncHandler = require('express-async-handler');

const AuthService = require('./auth.service');

const { Factory, ServiceHandler } = require('../../helpers');

class AuthController extends ServiceHandler {
    constructor(...services) {
        super(services);
    }

    login() {
        return asyncHandler(async (req, res) => {
            const { email, password } = req.body;

            const { user, token } = await this.authService.login(
                email,
                password
            );

            res.cookie('jwt', token, { httpOnly: true, secure: false }).json({
                message: 'success',
                data: {
                    email: user.email,
                },
            });
        });
    }

    register() {
        return asyncHandler(async (req, res) => {
            const { username, email, password } = req.body;

            const { user, mailToken, url } = await this.authService.register(
                username,
                email,
                password
            );

            res.setHeader('mailToken', mailToken);

            res.status(201).json({
                message: 'success',
                data: {
                    email: user.email,
                    url,
                },
            });
        });
    }

    logout() {
        return asyncHandler(async (req, res) => {
            res.clearCookie('jwt', { httpOnly: true, secure: false }).json({
                message: 'success',
            });
        });
    }

    forgotPassword() {
        return asyncHandler(async (req, res) => {
            const { email } = req.body;

            const { resetToken, url } = await this.authService.forgotPassword(
                email
            );

            res.setHeader('resetToken', resetToken);

            res.json({
                message: 'success',
                url,
            });
        });
    }

    resetPassword() {
        return asyncHandler(async (req, res) => {
            const { password1: password } = req.body;

            const { resetToken } = req.params;

            await this.authService.changePassword(resetToken, password);

            res.removeHeader('resetToken');

            res.json({
                message: 'success',
            });
        });
    }

    confirmMail() {
        return asyncHandler(async (req, res) => {
            const { mailToken } = req.params;

            await this.authService.confirmMail(mailToken);

            res.removeHeader('mailToken');

            res.json({
                message: 'success',
            });
        });
    }
}

module.exports = Factory.create(AuthController, AuthService);
