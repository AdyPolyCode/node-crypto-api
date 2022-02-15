const Router = require('express').Router({
    caseSensitive: true,
});

const AuthController = require('./auth.controller');

const { PayloadValidation, Authentication } = require('../../helpers');
const { login, register, forgotPassword, resetPassword } = require('./schemas');

/**
 * @swagger
 * definitions:
 *  LOGIN_BODY:
 *      type: object
 *      required: [email, password]
 *      properties:
 *          email:
 *              type: string
 *              example: ogre@1yam.com
 *          password:
 *              type: string
 *              example: notmypassword
 *  MODEL_LOGIN_USER:
 *      type: object
 *      properties:
 *          message:
 *              type: string
 *              example: Success
 *          data:
 *              type: object
 *              properties:
 *                  message:
 *                      type: string
 *                      example: halo@1halo.com
 *  NotFound:
 *      type: object
 *      properties:
 *          message:
 *              type: string
 *              example: 'Not found'
 *  Validation:
 *      type: object
 *      properties:
 *          message:
 *              type: string
 *              example: '"{something}" is missing from body || equality error'
 *  REGISTER_BODY:
 *      type: object
 *      required: [username, email, password]
 *      properties:
 *          username:
 *              type: string
 *              example: ogrekid
 *          email:
 *              type: string
 *              example: ogre@1yam.com
 *          password:
 *              type: string
 *              example: notmypassword
 *  MODEL_REGISTER_USER:
 *      type: object
 *      properties:
 *          messsage:
 *              type: string
 *              example: Success
 *          data:
 *              type: object
 *              properties:
 *                  email:
 *                      type: string
 *                      example: ogre@1yam.com
 *                  url:
 *                      type: string
 *                      example: http://localhost:{port}/api/auth/mail-confirmation/008988de431070ab1195490e0fd83ad716399d0a95965951c0a81ec40626dc5f
 *  Conflict:
 *      type: object
 *      properties:
 *          message:
 *              type: string
 *              example: '"{something}" already exists'
 *  MODEL_LOGOUT_USER:
 *      type: object
 *      properties:
 *          message:
 *              type: string
 *              example: Success
 *  Unauthorized:
 *      type: object
 *      properties:
 *          message:
 *              type: string
 *              example: Invalid authentication credentials
 *  FORGOT_BODY:
 *      type: object
 *      required: [email]
 *      properties:
 *          email:
 *              type: string
 *              example: ogre@1yam.com
 *  MODEL_FORGOT_PW:
 *      type: object
 *      properties:
 *          message:
 *              type: string
 *              example: Reset password email successfully sent
 *          url:
 *              type: string
 *              example: http://localhost:{port}/api/auth/password-reset/e4q5e45a1dae4eqda44eq564e4q5q54ra5d4a56
 *  MODEL_RESET_PW:
 *      type: object
 *      properties:
 *          message:
 *              type: string
 *              example: Success
 *  MODEL_CONFIRM_EMAIL:
 *      type: object
 *      properties:
 *          message:
 *              type: string
 *              example: Success
 */

/**
 * @swagger
 * /api/auth/mail-confirmation/{mailToken}:
 *  post:
 *      tags:
 *          - Auth
 *      summary: User email confirmation endpoint
 *      description:  Valid token must be provided
 *      consumes:
 *          - application/json
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: mailToken
 *            required: true
 *            description:  Confirm token string must be provided
 *      responses:
 *          200:
 *              description: OK - Successfully confirmed
 *              schema:
 *                  $ref: '#/definitions/MODEL_CONFIRM_EMAIL'
 *          401:
 *              description: UNAUTHORIZED - User cannot access this route due to an invalid token
 *              schema:
 *                  $ref: '#/definitions/Unauthorized'
 */
Router.post('/mail-confirmation/:mailToken', AuthController.confirmMail());

/**
 * @swagger
 * /api/auth/password-reset/{resetToken}:
 *  post:
 *      tags:
 *          - Auth
 *      summary: User password reset system
 *      description:  Valid token must be provided
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: resetToken
 *            required: true
 *            description:  Reset token string must be provided
 *      responses:
 *          200:
 *              description: OK - Successfully changed
 *              schema:
 *                  $ref: '#/definitions/MODEL_RESET_PW'
 *          401:
 *              description: UNAUTHORIZED - Cannot access this route due to an invalid token string
 *              schema:
 *                  $ref: '#/definitions/Unauthorized'
 *          406:
 *              description: VALIDATION ERROR - Given passwords do not equal
 *              schema:
 *                  $ref: '#/definitions/Validation'
 */
Router.post(
    '/password-reset/:resetToken',
    PayloadValidation.validate(resetPassword),
    AuthController.resetPassword()
);

/**
 * @swagger
 * /api/auth/forgot-password:
 *  post:
 *      tags:
 *          - Auth
 *      summary: User forgot password endpoint
 *      description: Valid user email must be provided
 *      consumes:
 *          - application/json
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: body
 *            name: body
 *            required: true
 *            description: Email data is required from the client.
 *            schema:
 *                  $ref: '#/definitions/FORGOT_BODY'
 *      responses:
 *          200:
 *              description: OK - Successfully sent
 *              schema:
 *                  $ref: '#/definitions/MODEL_FORGOT_PW'
 *          404:
 *              description: NOT FOUND - Resource was not found. This might happen of wrong email.
 *              schema:
 *                  $ref: '#/definitions/NotFound'
 */
Router.post(
    '/forgot-password',
    PayloadValidation.validate(forgotPassword),
    AuthController.forgotPassword()
);

/**
 * @swagger
 * /api/auth/login:
 *  post:
 *      tags:
 *          - Auth
 *      summary: User login system
 *      description: Email and password must be provided from client
 *      consumes:
 *          - application/json
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: body
 *            name: body
 *            required: true
 *            description: All body values must be provided
 *            schema:
 *                  $ref: '#/definitions/LOGIN_BODY'
 *      responses:
 *          200:
 *              description: OK - successfully signed in
 *              schema:
 *                  $ref: '#/definitions/MODEL_LOGIN_USER'
 *          404:
 *              description: NOT FOUND - User was not found.
 *              schema:
 *                  $ref: '#/definitions/NotFound'
 *          406:
 *              description: VALIDATION ERROR - Missing parameter from body
 *              schema:
 *                  $ref: '#/definitions/Validation'
 */
Router.post(
    '/login',
    PayloadValidation.validate(login),
    AuthController.login()
);

/**
 * @swagger
 * /api/auth/register:
 *  post:
 *      tags:
 *          - Auth
 *      summary: User register system
 *      description: Email, username and password must be provided from client
 *      consumes:
 *          - application/json
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: body
 *            name: body
 *            required: true
 *            description: All body values must be provided
 *            schema:
 *                  $ref: '#/definitions/REGISTER_BODY'
 *      responses:
 *          200:
 *              description: OK - successfully signed up
 *              schema:
 *                  $ref: '#/definitions/MODEL_REGISTER_USER'
 *          406:
 *              description: VALIDATION ERROR - Missing parameter from body
 *              schema:
 *                  $ref: '#/definitions/Validation'
 *          409:
 *              description: CONFLICT - The resource already exists
 *              schema:
 *                  $ref: '#/definitions/Conflict'
 */
Router.post(
    '/register',
    PayloadValidation.validate(register),
    AuthController.register()
);

/**
 * @swagger
 * /api/auth/logout:
 *  get:
 *      tags:
 *          - Auth
 *      summary: User logout system
 *      description: Valid tokenstring must be provided in order to use this endpoint
 *      produces:
 *          - application/json
 *      parameters: []
 *      responses:
 *          200:
 *              description: OK - Successfully logged out
 *              schema:
 *                  $ref: '#/definitions/MODEL_LOGOUT_USER'
 *          401:
 *              description: UNAUTHORIZED  User cannot access this route due to a wrong token string
 *              schema:
 *                  $ref: '#/definitions/Unauthorized'
 */
Router.get('/logout', Authentication.authenticateIt(), AuthController.logout());

module.exports = Router;
