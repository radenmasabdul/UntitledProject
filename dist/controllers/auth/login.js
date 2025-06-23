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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const express_validator_1 = require("express-validator");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = __importDefault(require("@/configs/database"));
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //periksa hasil validasi
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw { status: 422, message: "Validation error", errors: errors.array() };
        }
        // cari user berdasarkan email atau username
        const user = yield database_1.default.users.findFirst({
            where: {
                OR: [
                    { email: req.body.identifier },
                    { username: req.body.identifier }
                ]
            },
            select: {
                id: true,
                username: true,
                fullname: true,
                email: true,
                password: true,
            },
        });
        if (!user)
            throw { status: 404, message: "User not found" };
        // bandingkan password
        const validPassword = yield bcryptjs_1.default.compare(req.body.password, user.password);
        if (!validPassword)
            throw { status: 401, message: "Invalid password" };
        // buat token JWT
        const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        // hapus password sebelum dikirim ke response
        const { password } = user, userWithoutPassword = __rest(user, ["password"]);
        res.status(200).json({
            success: true,
            message: "Login successfully",
            data: {
                user: userWithoutPassword,
                token: token,
            },
        });
    }
    catch (error) {
        console.error("Login Error:", error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Internal server error",
            errors: error.errors || [],
        });
    }
});
exports.login = login;
