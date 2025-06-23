"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const logger_1 = __importDefault(require("./services/logger"));
const rateLimiters_1 = __importDefault(require("./middlewares/security/rateLimiters"));
const routes_1 = __importDefault(require("./routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
logger_1.default.info("Server is starting...");
//middleware
app.use((0, cors_1.default)());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
app.use((0, helmet_1.default)());
app.use((0, compression_1.default)());
app.use("/uploads", express_1.default.static("uploads"));
app.use((0, morgan_1.default)('dev'));
//log setiap request ke Winston
app.use((req, res, next) => {
    logger_1.default.info(`${req.method} ${req.url}`);
    next();
});
//rate limiting
app.use(rateLimiters_1.default);
//gunakan semua routes dengan prefix "/api"
app.use("/api", routes_1.default);
//routes
app.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.send('Hello World!');
    }
    catch (error) {
        next(error);
    }
}));
//global error handling middleware
app.use((err, req, res, next) => {
    logger_1.default.error(err.message);
    res.status(500).json({ message: "Internal Server Error" });
});
//start server
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
exports.default = app;
