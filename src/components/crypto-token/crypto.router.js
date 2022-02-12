const Router = require('express').Router({ caseSensitive: true });

const CryptoController = require('./crypto.controller');
const { QueryBuilder } = require('../../helpers');

Router.use(QueryBuilder.parseIt());

Router.get('/markets', CryptoController.getMarkets());

module.exports = Router;
