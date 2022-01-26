const Router = require('express').Router({ caseSensitive: true });

// TODO: import + add validation/auth mws

const AuthController = require('./auth.controller');

Router.post('/mail-confirmation/:mailToken', AuthController.confirmMail());
Router.post('/password-reset/:resetToken', AuthController.resetPassword());

Router.post('/forgot-password', AuthController.forgotPassword());

Router.post('/login', AuthController.login());
Router.post('/register', AuthController.register());
Router.get('/logout', AuthController.logout());

module.exports = Router;
