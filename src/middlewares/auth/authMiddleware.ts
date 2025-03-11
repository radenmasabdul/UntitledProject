import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "fallback-secret";

// extend Request Type untuk menyimpan user di req
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

// middleware untuk memverifikasi token JWT
export function verifyToken(req: Request, res: Response, next: NextFunction) {
    // ambil token dari header Authorization (format: Bearer <token>)
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthenticated." });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded; // simpan user yang terverifikasi di request
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token." });
    }
}