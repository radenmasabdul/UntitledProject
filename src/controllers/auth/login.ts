import { Request, Response } from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "@/configs/database";

export const login = async (req: Request, res: Response) => {
    try {
        //periksa hasil validasi
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw { status: 422, message: "Validation error", errors: errors.array() };
        }

        // cari user berdasarkan email atau username
        const user = await prisma.users.findFirst({
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

        if (!user) throw { status: 404, message: "User not found" };

        // bandingkan password
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) throw { status: 401, message: "Invalid password" };

        // buat token JWT
        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET as string,
            { expiresIn: "1h" }
        );

        // hapus password sebelum dikirim ke response
        const { password, ...userWithoutPassword } = user;

        res.status(200).json({
            success: true,
            message: "Login successfully",
            data: {
                user: userWithoutPassword,
                token: token,
            },
        });

    } catch (error: any) {
        console.error("Login Error:", error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Internal server error",
            errors: error.errors || [],
        });
    }
};