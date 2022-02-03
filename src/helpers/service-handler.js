module.exports = class ServiceHandler {
    constructor(services) {
        services.forEach((service) => {
            const firstPart = service.constructor.name[0].toLowerCase();
            const secondPart = service.constructor.name.slice(
                1,
                service.constructor.name.length
            );

            const serviceName = firstPart + secondPart;

            this[serviceName] = service;
        });
    }
};
