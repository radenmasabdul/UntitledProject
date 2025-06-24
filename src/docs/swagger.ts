import swaggerJSDoc from "swagger-jsdoc";
import path from "path";

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
  apis: [
    path.join(__dirname, "../routes/**/*.js"),
  ],
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
