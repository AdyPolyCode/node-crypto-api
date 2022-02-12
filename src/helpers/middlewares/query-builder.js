class QueryBuilderService {
    #pathOptions;

    constructor() {
        this.#pathOptions = {
            '/markets': {
                exchange: 'binance',
                base: 'BTC,ETH,LTC,XMR',
            },
        };
    }

    #parseCommon(path) {
        const options = this.#pathOptions[path];

        const len = Object.keys(options).length;

        const joinedQuery = Object.keys(options)
            .map((key, i) => {
                let value = `${key}=${options[key]}`;

                if (i < len - 1) {
                    value += '&';
                }

                return value;
            })
            .join('');

        return joinedQuery;
    }

    parseIt() {
        return (req, res, next) => {
            const queries = this.#parseCommon(req.query, req.url);

            req.query = { queries };

            next();
        };
    }
}

module.exports = new QueryBuilderService();
