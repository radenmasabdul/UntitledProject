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
        console.error("Get User Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

export const findUserById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const user = await prisma.users.findUnique({
            where: {
                id: id,
            },
            select: {
                id: true,
                username: true,
                fullname: true,
                email: true,
                profile_image: true,
                banner: true,
                bio: true,
            }
        });

        if (!user) {
            res.status(404).json({
                success: false,
                message: `User with ID ${id} not found`,
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: `Get user By ID :${id} Successfully`,
            data: user,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const existingUser = await prisma.users.findUnique({
            where: { id: id },
        });

        if(!existingUser) {
            res.status(404).json({
                success: false,
                message: `User with ID ${id} not found`,
            });
        }

        const updatedUser = await prisma.users.update({
            where: { id: id },
            data: req.body,
        });

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: updatedUser,
        })
    } catch (error) {
        console.error("Update User Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const existingUser = await prisma.users.findUnique({
            where: { id: id },
        });

        if(!existingUser) {
            res.status(400).json({
                success: false,
                message: `User with ID ${id} not found`,
            });
        }

        await prisma.users.delete({
            where: { id: id },
        });

        res.status(200).json({
            success: true,
            message: `User with ID ${id} deleted successfully`,
        });
    } catch (error) {
        console.error("Delete User Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}