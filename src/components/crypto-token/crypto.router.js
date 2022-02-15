const Router = require('express').Router({ caseSensitive: true });

const CryptoController = require('./crypto.controller');
const { QueryBuilder, Authentication } = require('../../helpers');

Router.use(Authentication.authenticateIt(), QueryBuilder.parseIt());

/**
 * @swagger
 * definitions:
 *  CRYPTO_MARKET_MODEL:
 *      type: object
 *      properties:
 *          data:
 *              type: array
 *              items:
 *                  type: object
 *                  properties:
 *                      exchange:
 *                          type: string
 *                          example: binance
 *                      market:
 *                          type: string
 *                          example: XMRBTC
 *                      base:
 *                          type: string
 *                          example: XMR
 *                      quote:
 *                          type: string
 *                          exampel: BTC
 */

/**
 * @swagger
 * /api/crypto/markets:
 *  get:
 *      tags:
 *          - Crypto
 *      summary: Get market related data
 *      description: Returns information on the exchanges and markets that Nomics API supports
 *      parameters:
 *          - in: query
 *            name: exchange
 *            required: false
 *            description: Nomics Exchange ID to filter by
 *            schema:
 *              type: string
 *              example: exchange=binance
 *          - in: query
 *            name: base
 *            required: false
 *            description: Comma separated list of base currencies to filter by
 *            schema:
 *              type: string
 *              example: base=BTC,ETH
 *      responses:
 *          200:
 *              description: Return all market related information
 *              schema:
 *                  $ref: '#/definitions/CRYPTO_MARKET_MODEL'
 *
 */
Router.get('/markets', CryptoController.getMarkets());

module.exports = Router;
