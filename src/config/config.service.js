const dotenv = require('dotenv');

class ConfigService {
    envs = {
        development: {
            logFormat: {
                colorForm: {
                    all: true,
                },
                labelForm: {
                    label: ' -$DevLog$-',
                },
                printer: (info) =>
                    `${info.label} - ${info.level} - ${info.message}`,
            },
        },
    };

    constructor() {
        dotenv.config({});
    }

    getValue(key) {
        return process.env[key];
    }

    loadNodeMailerConfig() {
        return {
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        };
    }

    loadJWTConfig() {
        return {
            secret: process.env.JWT_KEY,
            algorithm: process.env.JWT_ALGORITHM,
            expiresIn: process.env.JWT_EXPIRE,
        };
    }
}

module.exports = new ConfigService();
