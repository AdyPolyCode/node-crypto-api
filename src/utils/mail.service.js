const nodemailer = require('nodemailer');
const hbs = require('handlebars');
const { readFileSync } = require('fs');
const { join } = require('path');

const MessageQueueService = require('./message-queue.service');
const ConfigService = require('../config/config.service');
const LoggerService = require('../helpers/logger.service');

module.exports = class MailService {
    #options;

    constructor() {
        this.#options = {
            'mail-confirmation': {
                urlPath: '/api/auth/mail-confirmation',
                templatePath: join(
                    __dirname,
                    'templates/mail-confirmation.hbs'
                ),
                message:
                    'Please confirm this email so you can enjoy our services - ',
            },
            'password-reset': {
                urlPath: '/api/auth/password-reset',
                templatePath: join(__dirname, 'templates/password-reset.hbs'),
                message: 'Here is your reset password email - ',
            },
        };
    }

    #createUrl(type, token) {
        const port = ConfigService.getValue('NODE_PORT');

        const { urlPath } = this.#options[type];

        return `http://localhost:${port}${urlPath}/${token}`;
    }

    #createTemplate(type, url, message) {
        const { templatePath } = this.#options[type];

        const file = readFileSync(templatePath, 'utf8');

        return hbs.compile(file)({ URL: url, MESSAGE: message });
    }

    async mailIt(type, token, email) {
        try {
            const url = this.#createUrl(type, token);

            const { message } = this.#options[type];

            const template = this.#createTemplate(type, url, message);

            const transportOptions = ConfigService.loadNodeMailerConfig();

            const transporter = nodemailer.createTransport(transportOptions);

            await MessageQueueService.publish(
                {
                    from: 'sample@noreply.com',
                    to: email,
                    subject: type.toUpperCase(),
                    html: template,
                },
                type
            );

            await MessageQueueService.subscribe(transporter, type);

            return url;
        } catch (error) {
            LoggerService.error(error.stack);

            throw error;
        }
    }
};
