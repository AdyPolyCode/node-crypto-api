const asyncHandler = require('express-async-handler');

const CryptoService = require('./crypto.service');
const { Factory, ServiceHandler } = require('../../helpers');

class CryptoController extends ServiceHandler {
    constructor(...services) {
        super(services);
    }

    getMarkets() {
        return asyncHandler(async (req, res) => {
            const markets = await this.cryptoService.getMarkets(
                req.query.queries
            );

            res.json({ data: markets });
        });
    }
}

module.exports = Factory.create(CryptoController, CryptoService);
