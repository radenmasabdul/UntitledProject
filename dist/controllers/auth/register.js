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
exports.register = void 0;
const express_validator_1 = require("express-validator");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_1 = __importDefault(require("@/configs/database"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //periksa hasil validasi
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(422).json({
            success: false,
            message: "Validation error",
            errors: errors.array(),
        });
    }
    try {
        //hash password
        const hashedPassword = yield bcryptjs_1.default.hash(req.body.password, 10);
        //insert data ke database
        const user = yield database_1.default.users.create({
            data: {
                username: req.body.username,
                fullname: req.body.fullname,
                email: req.body.email,
                password: hashedPassword,
            }
        });
        // response sukses
        res.status(200).json({
            success: true,
            message: "Register successfully",
            data: user,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
exports.register = register;
