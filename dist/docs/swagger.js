"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const path_1 = __importDefault(require("path"));
const options = {
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
        path_1.default.join(__dirname, "../routes/**/*.js"),
    ],
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
exports.default = swaggerSpec;
