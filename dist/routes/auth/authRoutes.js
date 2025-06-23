"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const register_1 = require("@/controllers/auth/register");
const login_1 = require("@/controllers/auth/login");
const authValidator_1 = require("@/utils/validators/auth/authValidator");
const authRouter = express_1.default.Router();
authRouter.post("/register", authValidator_1.validateRegister, register_1.register);
authRouter.post("/login", authValidator_1.validateLogin, login_1.login);
exports.default = authRouter;
