import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'GuzoSync',
      version: '1.0.0',
      description: 'GuzoSync API documentation',
    },
  },
  apis: ['./**/*.ts'], // Path to your API route files (if using JSDoc)
  // apis: ['swagger.yaml'], // Path to your YAML/JSON file (if using a separate file)
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
