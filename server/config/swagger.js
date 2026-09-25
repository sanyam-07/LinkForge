import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LinkForge URL Shortener & Analytics API',
      version: '1.0.0',
      description:
        'Official REST API documentation for LinkForge — Production MERN Stack URL Shortener featuring Redis caching, Socket.IO real-time analytics, BullMQ queues, and OpenAI integration.',
      contact: {
        name: 'LinkForge Developer Team',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Local Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./server.js', './routes/*.js'],
};

export const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
