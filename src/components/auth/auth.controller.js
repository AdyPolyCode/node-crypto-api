const asyncHandler = require('express-async-handler');
const AuthService = require('./auth.service');

// TODO: after testing finish proper implementation

module.exports = class AuthController {
    static login() {
        return asyncHandler(async (req, res) => {
            const { email, password } = req.body;

            const { user, token } = await AuthService.login(email, password);

            // ! set cookie

            res.json({
                message: 'success',
                data: {
                    email: user.email,
                },
            });
        });
    }

    static register() {
        return asyncHandler(async (req, res) => {
            console.log(req.body);
            const { username, email, password } = req.body;

            const user = await AuthService.register(username, email, password);

            res.status(201).json({
                message: 'success',
                data: {
                    email: user.email,
                },
            });
        });
    }

    static logout() {
        return asyncHandler(async (req, res) => {
            // ! clear user from cookies

            res.json({
                message: 'success',
            });
        });
    }

    static forgotPassword() {
        return asyncHandler(async (req, res) => {
            const { email } = req.body;

            await AuthService.forgotPassword(email);

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
