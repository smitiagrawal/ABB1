const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Auction API',
    version: '1.0.0',
    description: 'API for managing auctions and bids',
  },
  servers: [
    {
      url: 'http://localhost:5000/api',
      description: 'Local server',
    },
  ],
  components: {
    schemas: {
      Auction: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Unique identifier for the auction',
          },
          user: {
            type: 'string',
            description: 'ID of the user who created the auction',
          },
          title: {
            type: 'string',
            description: 'Title of the auction',
          },
          description: {
            type: 'string',
            description: 'Description of the auction',
          },
          startingBid: {
            type: 'number',
            format: 'float',
            description: 'Starting bid amount',
          },
          currentBid: {
            type: 'number',
            format: 'float',
            description: 'Current bid amount',
          },
          endDate: {
            type: 'string',
            format: 'date-time',
            description: 'End date of the auction',
          },
          image: {
            type: 'string',
            description: 'URL of the auction image',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Date when the auction was created',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Date when the auction was last updated',
          },
        },
      },
      Bid: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Unique identifier for the bid',
          },
          amount: {
            type: 'number',
            format: 'float',
            description: 'Bid amount',
          },
          user: {
            type: 'string',
            description: 'ID of the user who placed the bid',
          },
          auction: {
            type: 'string',
            description: 'ID of the auction the bid is placed on',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Date when the bid was placed',
          },
        },
      },
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Unique identifier for the user',
          },
          name: {
            type: 'string',
            description: 'Name of the user',
          },
          email: {
            type: 'string',
            description: 'Email of the user',
          },
          password: {
            type: 'string',
            description: 'Password of the user',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Date when the user was created',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Date when the user was last updated',
          },
        },
      },
    },
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};

const options = {
  definition: swaggerDefinition,
  apis: ['./routes/*.js'], // Path to your API routes
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = swaggerDocs;
