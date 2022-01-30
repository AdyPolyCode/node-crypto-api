const express = require('express');
const app = express();

const appLoader = require('./loaders');

appLoader(app);
