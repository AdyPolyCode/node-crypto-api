const { BadRequest } = require('../../errors');

const QueryBuilder = require('../common/query-builder');

// TODO: finish validator & common parser

class QueryBuilderService extends QueryBuilder {
    #defaultOptions;

    #marketOptions;

    #currencyMetaOptions;

    constructor() {
        super({ sort: 'rank', filter: 'new' });

        this.#marketOptions = {
            exchange: '&exchange=binance',
            base: '&base=BTC,ETH,LTC,XMR',
        };

        this.#currencyMetaOptions = {
            ids: '&ids=BTC,ETH,XRP',
            attributes: '&attributes=id,name,logo_url',
        };
    }

    #validateQueries(queries) {
        if (false) {
            throw new BadRequest('Bad Request');
        }

        return queries;
    }

    #parseCommon(queries) {
        const { limit, page, sort, filter, base, id, attributes } = queries;

        const options = { ...this.#defaultOptions };

        if (limit) {
            options.limit = parseInt(limit, 10);
        }

        if (page) {
            options.page = parseInt(page, 10);
        }

        if (base) {
            options.base = base;
        }

        if (id) {
            options.ids = id;
        }

        if (attributes) {
            options.attributes = attributes;
        }

        if (sort) {
            options.sort = sort;
        }

        if (filter) {
            options.filter = filter;
        }

        return options;
    }

    // currencies api
    // sort: rank first_priced_at
    // filer: new any
    // page: any number
    // per-page: any number
    // status: active inactive dead
    // convert: currency

    // market api
    // exchange: (BTC, ETH) Exchange ID to filter by
    // base: (BTC, ETH) Comma separated list of base currencies to filter by
    // page: any number
    parseMarkets() {
        return (req, res, next) => {
            this.#validateQueries(req.query);

            const queries = this.#parseCommon(req.query);

            req.query = queries;

            next();
        };
    }

    parseCurrencies(args) {
        return (req, res, next) => {
            this.#validateQueries(req.query);

            const queries = this.#validateQueries(req.query);

            req.query = queries;

            next();
        };
    }
}

module.exports = new QueryBuilderService();
