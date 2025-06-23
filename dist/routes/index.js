"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authRoutes_1 = __importDefault(require("./auth/authRoutes"));
const userRoutes_1 = __importDefault(require("./user/userRoutes"));
const postRoutes_1 = __importDefault(require("./posts/postRoutes"));
const router = express_1.default.Router();
router.use("/auth", authRoutes_1.default);
router.use("/users", userRoutes_1.default);
router.use("/posts", postRoutes_1.default);
exports.default = router;
