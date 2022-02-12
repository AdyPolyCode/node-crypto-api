const Router = require('express').Router({ caseSensitive: true });

const AuthController = require('./auth.controller');

const { PayloadValidation, Authentication } = require('../../helpers');
const { login, register, forgotPassword, resetPassword } = require('./schemas');

Router.post('/mail-confirmation/:mailToken', AuthController.confirmMail());
Router.post(
    '/password-reset/:resetToken',
    PayloadValidation.validate(resetPassword),
    AuthController.resetPassword()
);

Router.post(
    '/forgot-password',
    PayloadValidation.validate(forgotPassword),
    AuthController.forgotPassword()
);

Router.post(
    '/login',
    PayloadValidation.validate(login),
    AuthController.login()
);
Router.post(
    '/register',
    PayloadValidation.validate(register),
    AuthController.register()
);
Router.get('/logout', Authentication.authenticateIt(), AuthController.logout());

module.exports = Router;
