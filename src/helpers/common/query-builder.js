module.exports = class QueryBuilder {
    #defaultOptions;

    constructor({ sort, filter }) {
        this.#defaultOptions = {
            limit: 10,
            page: 1,
            sort: sort || undefined,
            filter: filter || undefined,
        };
    }
};
