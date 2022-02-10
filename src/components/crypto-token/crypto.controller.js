const asyncHandler = require('express-async-handler');

const CryptoService = require('./crypto.service');
const { Factory, ServiceHandler } = require('../../helpers');

class CryptoController extends ServiceHandler {
    constructor(...services) {
        super(services);
    }

    getMarkets() {
        return asyncHandler(async (req, res) => {
            const markets = await this.cryptoService.getMarkets(req.query);

            res.json({ data: markets });
        });
    }

    getCurrencyMetaData() {
        return asyncHandler(async (req, res) => {
            const currencies = await this.cryptoService.getCurrencyMetaData(
                req.query
            );

            res.json({ data: currencies });
        });
    }
}

module.exports = Factory.create(CryptoController, CryptoService);
