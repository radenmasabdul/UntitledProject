import { Request, Response } from "express";
import prisma from "@/configs/database";

export const findUsers = async (req: Request, res: Response) => {
    try {
        const users  = await prisma.users.findMany({
            select: {
                id: true,
                username: true,
                fullname: true,
                email: true,
                profile_image: true,
                banner: true,
                bio: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        res.status(200).json({
            success: true,
            message: "Get all users successfully",
            data: users,
        });

    } catch (error) {
        console.error("FindUsers Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}