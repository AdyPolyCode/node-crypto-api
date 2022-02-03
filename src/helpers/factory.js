module.exports = class Factory {
    static create(controller, mainService, ...services) {
        if (services.length) {
            const instances = services.map((service) => new service());

            const Service = new mainService(...instances);

            return Service;
        }

        const Controller = new controller(mainService);

        return Controller;
    }
};
