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
exports.validateLogin = exports.validateRegister = void 0;
const express_validator_1 = require("express-validator");
const database_1 = __importDefault(require("@/configs/database"));
// validasi untuk Register
exports.validateRegister = [
    (0, express_validator_1.body)("username")
        .notEmpty().withMessage("Username is required")
        .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield database_1.default.users.findUnique({ where: { username: value } });
        if (user) {
            throw new Error("Username already exists");
        }
        return true;
    })),
    (0, express_validator_1.body)("fullname").notEmpty().withMessage("Fullname is required"),
    (0, express_validator_1.body)("email")
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Email is invalid")
        .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield database_1.default.users.findUnique({ where: { email: value } });
        if (user) {
            throw new Error("Email already exists");
        }
        return true;
    })),
    (0, express_validator_1.body)("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
];
// validasi untuk Login (bisa pakai email atau username)
exports.validateLogin = [
    (0, express_validator_1.body)("identifier")
        .notEmpty().withMessage("Email or username is required"),
    (0, express_validator_1.body)("password")
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
];
