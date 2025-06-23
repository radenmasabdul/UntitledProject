"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = verifyToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET_KEY = process.env.JWT_SECRET || "fallback-secret";
// middleware untuk memverifikasi token JWT
function verifyToken(req, res, next) {
    var _a;
    // ambil token dari header Authorization (format: Bearer <token>)
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "Unauthenticated." });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, SECRET_KEY);
        req.user = decoded; // simpan user yang terverifikasi di request
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Invalid token." });
        return;
    }
}
