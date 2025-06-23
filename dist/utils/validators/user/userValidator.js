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
exports.validateUser = void 0;
const express_validator_1 = require("express-validator");
const database_1 = __importDefault(require("@/configs/database"));
// validasi untuk Create atau Update User
exports.validateUser = [
    (0, express_validator_1.body)("username")
        .notEmpty().withMessage("Username is required")
        .custom((value_1, _a) => __awaiter(void 0, [value_1, _a], void 0, function* (value, { req }) {
        var _b;
        const userId = (_b = req.params) === null || _b === void 0 ? void 0 : _b.id; // pastikan params ada
        const existingUser = yield database_1.default.users.findUnique({ where: { username: value } });
        if (existingUser && existingUser.id !== userId) {
            throw new Error("Username already exists");
        }
        return true;
    })),
    (0, express_validator_1.body)("fullname").notEmpty().withMessage("Fullname is required"),
    (0, express_validator_1.body)("email")
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Email is invalid")
        .custom((value_1, _a) => __awaiter(void 0, [value_1, _a], void 0, function* (value, { req }) {
        var _b;
        const userId = (_b = req.params) === null || _b === void 0 ? void 0 : _b.id; // pastikan params ada
        const existingUser = yield database_1.default.users.findUnique({ where: { email: value } });
        if (existingUser && existingUser.id !== userId) {
            throw new Error("Email already exists");
        }
        return true;
    })),
    (0, express_validator_1.body)("password")
        .optional() // password bisa dikosongkan saat update
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
        .bail()
        .custom((value, { req }) => {
        if (req.method === "POST" && !value) {
            throw new Error("Password is required when creating a user");
        }
        return true;
    }),
];
