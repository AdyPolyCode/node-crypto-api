const axios = require('axios').default;

const ConfigService = require('../../config/config.service');

class CryptoService {
    constructor() {
        this.key = ConfigService.getValue('NOMICS_API_KEY');
        this.url = ConfigService.getValue('NOMICS_API_URL');
    }

    async getMarkets(queries) {
        const url = this.url.concat('markets?key=', this.key, '&', queries);

        const data = await axios.get(url);

        return data.data;
    }
}

module.exports = new CryptoService();
