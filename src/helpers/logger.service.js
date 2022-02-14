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
    format: pretty,
    transports: [new transports.Console()],
});
