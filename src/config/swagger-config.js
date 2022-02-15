const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
    swaggerDefinition: {
        swagger: '2.0',
        info: {
            title: 'Crypto Api',
            version: '1.0.0',
        },
        consumes: 'application/json',
        produces: 'application/json',
        tags: [
            {
                name: 'Crypto',
                description: 'Crypto currency information service handlers',
            },
            {
                name: 'Auth',
                description: 'Authentication service handlers',
            },
        ],
    },
    apis: ['./src/components/**/*.router.js'],
};

module.exports = swaggerJsDoc(swaggerOptions);
