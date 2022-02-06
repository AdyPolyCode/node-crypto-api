/* eslint-disable import/no-extraneous-dependencies */
const { format, addColors, transports, createLogger } = require('winston');

const {
    envs: {
        development: { logFormat },
    },
} = require('../config/config.service');

const pretty = format.combine(
    format.colorize(logFormat.colorForm),
    format.label(logFormat.labelForm),
    format.printf(logFormat.printer)
);

addColors({
    error: 'bold red',
    warn: 'bold orange',
    info: 'bold blue',
});

module.exports = createLogger({
    transports: [
        new transports.Console({
            level: 'error',
            format: format.combine(format.colorize(), pretty),
        }),
        new transports.Console({
            level: 'info',
            format: format.combine(format.colorize(), pretty),
        }),
        new transports.Console({
            level: 'warn',
            format: format.combine(format.colorize(), pretty),
        }),
    ],
});
