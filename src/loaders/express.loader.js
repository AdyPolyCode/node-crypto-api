const express = require('express');

const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const { ErrorService } = require('../helpers');

const authRouter = require('../components/auth/auth.router');
const cryptoRouter = require('../components/crypto-token/crypto.router');

module.exports = (app) => {
    app.use(
        cors({
            origin: '*',
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
        })
    );
    app.use(helmet());
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());

    /* eslint-disable import/no-extraneous-dependencies */
    if (process.env.NODE_ENV === 'dev') {
        app.use(require('morgan')('dev'));
    }
    /* eslint-enable import/no-extraneous-dependencies */

    app.get('/test', async (req, res) => {
        res.json({
            message: 'O.K',
        });
    });

    app.use('/api/auth', authRouter);
    app.use('/api/crypto', cryptoRouter);

    app.use(ErrorService.handleNotFound());
    app.use(ErrorService.handleException());

    return app;
};
