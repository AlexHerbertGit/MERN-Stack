// Swagger Configuration

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Kobra Kai Charity API',
      version: '1.0.0',
      description: 'MERN prototype for Auth (JWT), Meals, and Orders',
    },
    servers: [{ url: 'http://localhost:4000/api' }],
    tags: [
      { name: 'Auth', description: 'Registration, login, session' },
      { name: 'Meals', description: 'Meals CRUD for members' },
      { name: 'Orders', description: 'Token-based ordering & acceptance' },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description:
            'Send the JWT as: Authorization: Bearer <token>. (Your API also accepts HttpOnly cookie "jwt".)',
        },
      },
      schemas: {
        // ====== Common ======
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  msg: { type: 'string' },
                  param: { type: 'string' },
                  location: { type: 'string' },
                },
              },
            },
          },
        },

        // ====== Auth ======
        AuthRegisterInput: {
          type: 'object',
          required: ['name', 'email', 'password', 'role'],
          properties: {
            name: { type: 'string', example: 'Aroha' },
            email: { type: 'string', format: 'email', example: 'aroha@kk.nz' },
            password: { type: 'string', minLength: 6, example: 'P@ssword1' },
            role: { type: 'string', enum: ['beneficiary', 'member'], example: 'beneficiary' },
          },
        },
        AuthLoginInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'aroha@kk.nz' },
            password: { type: 'string', example: 'P@ssword1' },
          },
        },
        AuthUser: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '665ee9d2b7e3b8e0a8b62e11' },
            name: { type: 'string', example: 'Aroha' },
            email: { type: 'string', example: 'aroha@kk.nz' },
            role: { type: 'string', enum: ['beneficiary', 'member'] },
            tokenBalance: { type: 'integer', example: 10 },
          },
        },

        // ====== Meals ======
        Meal: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            memberId: { type: 'string' },
            title: { type: 'string', example: 'Roast Chicken' },
            description: { type: 'string', example: 'GF option' },
            dietary: { type: 'array', items: { type: 'string' }, example: ['gluten-free'] },
            qtyAvailable: { type: 'integer', example: 5 },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        MealInput: {
          type: 'object',
          required: ['title'],
          properties: {
            title: { type: 'string', example: 'Roast Chicken' },
            description: { type: 'string', example: 'GF option' },
            dietary: { type: 'array', items: { type: 'string' }, example: ['gluten-free'] },
            qtyAvailable: { type: 'integer', example: 5 },
          },
        },

        // ====== Orders ======
        Order: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            mealId: { type: 'string' },
            beneficiaryId: { type: 'string' },
            memberId: { type: 'string' },
            status: { type: 'string', enum: ['pending', 'accepted', 'cancelled'] },
            costTokens: { type: 'integer', example: 1 },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        PlaceOrderInput: {
          type: 'object',
          required: ['mealId'],
          properties: {
            mealId: { type: 'string', example: '665f0a7a4d3f1b2c9b9dd001' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

const specs = swaggerJsdoc(options);

function setupSwagger(app) {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs));
}

module.exports = setupSwagger;
