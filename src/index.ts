import express, { Request, Response } from 'express'
import cors from 'cors';
import helmet from 'helmet'
import compression from 'compression'
import dotenv from 'dotenv';
import morgan from 'morgan';
import logger from './services/logger'
import limiter from './middlewares/security/rateLimiters';
import router from './routes';

import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './docs/swagger';

dotenv.config();

const app = express();
app.set('trust proxy', 1);

const port = process.env.PORT;

logger.info("Server is starting...");

//middleware
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(helmet());
app.use(compression());
app.use("/uploads", express.static("uploads"));
app.use(morgan('dev'));

//log setiap request ke Winston
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
});

//rate limiting
app.use(limiter);

// Swagger endpoint
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//gunakan semua routes dengan prefix "/api"
app.use("/api", router);

//routes
app.get('/', async (req: Request, res: Response, next) => {
    try {
        res.send('Hello World!');
    } catch (error) {
        next(error);
    }
});

//global error handling middleware
app.use((err: Error, req: Request, res: Response, next: Function) => {
    logger.error(err.message);
    res.status(500).json({ message: "Internal Server Error" });
});

//start server
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

console.log("🟢 Environment Loaded");
console.log("🌐 PORT:", process.env.PORT);
console.log("🔐 JWT:", process.env.JWT_SECRET?.slice(0, 6) + "...");
console.log("🛢️ DB:", process.env.DATABASE_URL?.includes("localhost") ? "Local" : "Production");

export default app;