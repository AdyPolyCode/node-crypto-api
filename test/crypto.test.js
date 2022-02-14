require('dotenv').config({ path: '../.env' });

const request = require('supertest');
const expressApp = require('express')();

const expressLoader = require('../src/loaders/express.loader');

const app = expressLoader(expressApp);

describe('given crypto based get endpoints', () => {
    it('/markets', async () => {
        const response = await request(app).get('/api/crypto/markets');

        expect(response.status).toEqual(200);
    });
});
