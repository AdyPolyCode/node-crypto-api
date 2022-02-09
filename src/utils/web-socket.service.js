const axios = require('axios').default;

const ConfigService = require('../config/config.service');
const { LoggerService } = require('../helpers');

/* eslint-disable consistent-return, array-callback-return, no-param-reassign */
class SocketService {
    static init(io, socket) {
        this.instance = new SocketService();

        this.instance.key = ConfigService.getValue('NOMICS_API_KEY');
        this.instance.url = ConfigService.getValue('NOMICS_API_URL');

        this.instance.intervals = {
            customInterval: undefined,
            averageInterval: undefined,
            pricesInterval: undefined,
        };

        this.instance.repeatTime = 5000;

        this.instance.#handleEvents(io, socket);
    }

    #handleEvents(io, socket) {
        socket.on('get prices', (options) => {
            const { currency } = options;

            this.intervals.prices = setInterval(async () => {
                try {
                    const prices = await this.#getPrices({
                        currency,
                    });

                    const averages = await this.#getAverage();

                    const [price, average] = await Promise.all([
                        prices,
                        averages,
                    ]);

                    io.emit('prices', { price, average });
                } catch (error) {
                    io.emit('error', error.message);
                }
            }, this.repeatTime);
        });
    }

    #filterIt(payload, options) {
        const { currency } = options;

        let result = payload;

        if (currency) {
            result = payload.filter((obj) => {
                if (currency.includes(obj.currency)) {
                    obj.price = Math.floor(obj.price);

                    return obj;
                }
            });
        }

        this.prices = result.map((obj) => obj.price);
        this.numberOfTypes = result.length;

        return result;
    }

    async #getAverage() {
        if (this.prices && this.numberOfTypes) {
            const sumOfPrices = this.prices.reduce((prev, cur) => prev + cur);

            const average = Math.floor(sumOfPrices / this.numberOfTypes);

            return average;
        }
    }

    async #getPrices(options) {
        try {
            const url = this.url.concat('prices?key=', this.key);

            const payload = await axios.get(url);

            const result = this.#filterIt(payload.data, options);

            return result;
        } catch (error) {
            LoggerService.error(error.message);
        }
    }
}

module.exports = SocketService;
