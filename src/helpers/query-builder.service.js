const Parser = require('./common/parser');

const { BadRequest } = require('../errors/bad-request');

// TODO: finish query parser

class QueryBuilderService extends Parser {
    #defaultOptions = {
        limit: 10,
        page: 1,
        sort: { createdAt: 'desc' },
    };

    #validateQueries(arg) {
        if (
            typeof arg !== 'object' ||
            (arg instanceof Object && arg instanceof Array)
        ) {
            throw new BadRequest(`Wrong query string provided`);
        }
    }

    parse(...args) {
        super.parse(...args);

        const unit = args.length <= 1 ? args[0] : args;

        this.#validateQueries(unit);

        const { limit, page, sort, filter } = unit;

        const returnOptions = {
            limit: parseInt(limit, 10) || this.#defaultOptions['limit'],
            page: parseInt(page, 10) || this.#defaultOptions['page'],
        };

        if (sort) {
            const result = this.#parseSort(sort);

            returnOptions.sort = result;
        } else {
            returnOptions.sort = this.#defaultOptions['sort'];
        }

        if (filter) {
            const result = this.#parseFilter(filter);

            returnOptions.filter = result;
        }

        return returnOptions;
    }

    #parseFilter(arg) {}

    #parseSort(arg) {}
}

module.exports = new QueryBuilderService();
