import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import prisma from '@/configs/database';

export const register = async (req: Request, res: Response) => {
    //periksa hasil validasi
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        res.status(422).json({
            success: false,
            message: "Validation error",
            errors: errors.array(),
        })
    }

    try {
        //hash password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        //insert data ke database
        const user = await prisma.users.create({
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
        
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};