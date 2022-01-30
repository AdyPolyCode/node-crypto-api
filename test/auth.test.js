require('dotenv').config({ path: '../.env' });

const mongoose = require('mongoose');
const request = require('supertest');
const expressApp = require('express')();

const expressLoader = require('../src/loaders/express.loader');
const connectDB = require('../src/loaders/database.loader.js');

const app = expressLoader(expressApp);

describe('authentication endpoints', () => {
    beforeAll(async () => {
        try {
            await connectDB(process.env.TEST_MONGO_URI);
        } catch (error) {
            console.log(error.message);
            process.exit(1);
        }
    });

    describe('given user based post/get endpoints', () => {
        it('/register', async () => {
            const payload = {
                username: 'adamoss',
                email: 'adamoss@sample.com',
                password: '123456789',
            };

            const response = await request(app)
                .post('/api/auth/register')
                .send(payload);

            const responseObject = {
                data: { email: payload.email },
                message: 'success',
            };

            expect(response.statusCode).toEqual(201);
            expect(response.body).toEqual(responseObject);
        });

        it('/login', async () => {
            const payload = {
                email: 'adamoss@sample.com',
                password: '123456789',
            };

            const response = await request(app)
                .post('/api/auth//login')
                .send(payload);

            const responseObject = {
                data: { email: payload.email },
                message: 'success',
            };

            expect(response.statusCode).toEqual(200);
            expect(response.body).toEqual(responseObject);
        });

        it('/logout', async () => {
            const response = await request(app).get('/api/auth/logout');

            const responseObject = {
                message: 'success',
            };

            expect(response.statusCode).toEqual(200);
            expect(response.body).toEqual(responseObject);
        });

        it('/forgot-password', async () => {
            const payload = {
                email: 'adamoss@sample.com',
            };

            const response = await request(app)
                .post('/api/auth/forgot-password')
                .send(payload);

            const responseObject = {
                data: payload,
                message: 'success',
            };

            expect(response.statusCode).toEqual(200);
            expect(response.body).toEqual(responseObject);
        });

        it('/password-reset/resetToken', async () => {
            const payload = {
                confirmPassword: '123456789',
                password: '123456789',
                resetToken: 'resetToken',
            };

            const response = await request(app)
                .post('/api/auth/password-reset/resetToken')
                .send(payload);

            const responseObject = {
                data: {
                    password: '123456789',
                    resetToken: 'resetToken',
                },
                message: 'success',
            };

            expect(response.statusCode).toEqual(200);
            expect(response.body).toEqual(responseObject);
        });

        it('/mail-confirmation/mailToken', async () => {
            const payload = {
                mailToken: 'mailToken',
            };

            const response = await request(app)
                .post('/api/auth/mail-confirmation/mailToken')
                .send(payload);

            const responseObject = {
                data: payload,
                message: 'success',
            };

            expect(response.statusCode).toEqual(200);
            expect(response.body).toEqual(responseObject);
        });
    });

    afterAll(async () => {
        try {
            await mongoose.model('User').deleteMany();

            await mongoose.connection.close();
        } catch (error) {
            console.log(error.message);
            process.exit(1);
        }
    });
});
