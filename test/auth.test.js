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
            process.exit(1);
        }
    });

    describe('given user based post/get success endpoints', () => {
        let cookie;
        let mailToken;
        let resetToken;

        it('/register', async () => {
            const payload = {
                username: 'adamoss',
                email: 'adamoss@sample.com',
                password: '123456789',
            };

            const response = await request(app)
                .post('/api/auth/register')
                .send(payload);

            mailToken = response.headers.mailtoken;

            expect(response.statusCode).toEqual(201);
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toHaveProperty('email');
            expect(response.body.data).toHaveProperty('url');
            expect(response.body).toHaveProperty('message');
        });

        it('/mail-confirmation/mailToken', async () => {
            const response = await request(app).post(
                `/api/auth/mail-confirmation/${mailToken}`
            );

            expect(response.statusCode).toEqual(200);
            expect(response.body).toHaveProperty('message');
        });

        it('/login', async () => {
            const payload = {
                email: 'adamoss@sample.com',
                password: '123456789',
            };

            const response = await request(app)
                .post('/api/auth//login')
                .send(payload);

            cookie = response.headers['set-cookie'][0]
                .split('jwt=')[1]
                .split(';')[0];

            expect(response.statusCode).toEqual(200);
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toHaveProperty('email');
            expect(response.body).toHaveProperty('message');
        });

        it('/logout', async () => {
            const response = await request(app)
                .get('/api/auth/logout')
                .set('Cookie', cookie);

            expect(response.statusCode).toEqual(200);
            expect(response.body).toHaveProperty('message');
        });

        it('/forgot-password', async () => {
            const payload = {
                email: 'adamoss@sample.com',
            };

            const response = await request(app)
                .post('/api/auth/forgot-password')
                .send(payload);

            resetToken = response.headers.resettoken;

            expect(response.statusCode).toEqual(200);
            expect(response.body).toHaveProperty('message');
        });

        it('/password-reset/resetToken', async () => {
            const payload = {
                password1: 'hablabla',
                password2: 'hablabla',
            };

            const response = await request(app)
                .post(`/api/auth/password-reset/${resetToken}`)
                .send(payload);

            expect(response.statusCode).toEqual(200);
            expect(response.body).toHaveProperty('message');
        });
    });

    describe('given user based post/get failure endpoints', () => {
        it('/register without a req prop', async () => {
            const payload = {
                username: 'adamoss',
                email: 'adamoss@sample.com',
            };

            const response = await request(app)
                .post('/api/auth/register')
                .send(payload);

            expect(response.statusCode).toEqual(422);
            expect(response.body).toEqual({
                message: '"password" is required',
            });
        });

        it('/register with an already exist prop', async () => {
            const payload = {
                username: 'adamoss',
                email: 'adamoss@sample.com',
                password: 'hablabla',
            };

            const response = await request(app)
                .post('/api/auth/register')
                .send(payload);

            expect(response.statusCode).toEqual(400);
            expect(response.body).toEqual({
                message: 'Object already exists',
            });
        });

        it('/login without a req prop', async () => {
            const payload = {
                email: 'adamoss@sample.com',
            };

            const response = await request(app)
                .post('/api/auth//login')
                .send(payload);

            expect(response.statusCode).toEqual(422);
            expect(response.body).toHaveProperty('message');
        });

        it('/logout without auth', async () => {
            const response = await request(app).get('/api/auth/logout');

            expect(response.statusCode).toEqual(401);
            expect(response.body).toHaveProperty('message');
        });
    });

    afterAll(async () => {
        try {
            await mongoose.model('User').deleteMany();

            await mongoose.connection.close();
        } catch (error) {
            process.exit(1);
        }
    });
});
