const express = require('express');
const app = express();

const expressLoader = require('./loaders/express.loader');
const appLoader = require('./loaders');

const expressApp = expressLoader(app);

appLoader(expressApp);
