import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Untitled Project API',
      version: '1.0.0',
      description: 'Dokumentasi API untuk Untitled Project',
    },
    servers: [
      {
        url: 'https://untitledproject-production.up.railway.app/api',
      },
    ],
  },
  apis: [__dirname + '/../routes/**/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
