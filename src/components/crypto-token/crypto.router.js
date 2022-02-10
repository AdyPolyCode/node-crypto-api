const Router = require('express').Router({ caseSensitive: true });

const CryptoController = require('./crypto.controller');
const { QueryBuilder } = require('../../helpers');

Router.get(
    '/markets',
    QueryBuilder.parseMarkets,
    CryptoController.getMarkets()
);

Router.get(
    '/currencies',
    QueryBuilder.parseCurrencies,
    CryptoController.getCurrencyMetaData()
);

module.exports = Router;
