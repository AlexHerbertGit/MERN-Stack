// Swagger Config 

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Kobra Kai Chirty API',
            version: '1.0.0',
            description: 'API documentation for MERN prototype (Users, Meals, Orders)',
        },
        servers: [
            {
                url: 'http://localhost:4000/api',
            },
        ],
    },
    apis: ['./src/routes/*.js'],
};

const specs = swaggerJsdoc(options);

function setupSwagger(app) {
    app.use('.api/docs', swaggerUi.serve, swaggerUi.setup(specs));
}

module.exports = swaggerSetup;