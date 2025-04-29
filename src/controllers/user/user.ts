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

export const updateProfileImage = async (req: Request, res: Response) => {
    const { id } = req.params;
    const file = req.file as Express.Multer.File;

    if (!req.file) {
        res.status(400).json({
            success: false,
            message: "No image file uploaded",
        });
        return;
    }

    try {
        const updatedUser = await prisma.users.update({
            where: { id },
            data: {
                profile_image: `${file.filename}`,
            }
        });

        res.status(200).json({
            success: true,
            message: "Profile image updated successfully",
            data: updatedUser,
        });
    } catch (error) {
        console.error("Update Profile Image Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

export const updateBanner = async (req: Request, res: Response) => {
    const { id } = req.params;
    const file = req.file as Express.Multer.File;

    if(!req.file) {
        res.status(400).json({
            success: false,
            message: "No Banner image uploaded",
        });
        return;
    }

    try {
        const updatedUser = await prisma.users.update({
            where: { id },
            data: {
                banner: `${file.filename}`,
            }
        });

        res.status(200).json({
            success: true,
            message: "Banner updated successfully",
            data: updatedUser,
        });
    } catch (error) {
        console.error("UpdateBanner Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

export const followUser = async (req: Request, res: Response) => {
    const { id: followingId } = req.params;
    const followerId = req.user?.id;

    if (!followerId) {
        res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
        return;
    }

    if (followerId === followingId) {
        res.status(400).json({
            success: false,
            message: "You cannot follow yourself.",
        });
        return;
    }

    try {
        const targetUser = await prisma.users.findUnique({
            where: { id: followingId },
        });

        if (!targetUser) {
            res.status(404).json({
                success: false,
                message: `User with ID ${followingId} not found.`,
            });
            return;
        }

        const alreadyFollowing = await prisma.followers.findFirst({
            where: {
                followerId,
                followingId,
            },
        });

        if (alreadyFollowing) {
            res.status(400).json({
                success: false,
                message: "You are already following this user.",
            });
            return;
        }

        const follow = await prisma.followers.create({
            data: {
                followerId,
                followingId,
            },
        });

        res.status(201).json({
            success: true,
            message: `You are now following user with ID ${followingId}`,
            data: follow,
        });

    } catch (error) {
        console.error("Follow User Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const unfollowUser = async (req: Request, res: Response) => {
    const { id: followingId } = req.params;
    const followerId = req.user?.id;

    if (!followerId) {
        res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
        return;
    }

    if (followerId === followingId) {
        res.status(400).json({
            success: false,
            message: "You cannot unfollow yourself.",
        });
        return;
    }

    try {
        const existingFollow = await prisma.followers.findFirst({
            where: {
                followerId,
                followingId,
            },
        });

        if (!existingFollow) {
            res.status(400).json({
                success: false,
                message: "You are not following this user.",
            });
            return;
        }

        await prisma.followers.delete({
            where: {
                id: existingFollow.id,
            },
        });

        res.status(200).json({
            success: true,
            message: `You have unfollowed user with ID ${followingId}`,
        });
    } catch (error) {
        console.error("Unfollow User Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

export const getUserFollowers = async (req: Request, res: Response) => {
    const { id: userId } = req.params;

    try {
        const followers = await prisma.followers.findMany({
            where: { followingId: userId },
            include: {
                follower: {
                    select: {
                        id: true,
                        username: true,
                        fullname: true,
                        email: true,
                        profile_image: true,
                        banner: true,
                        bio: true,
                    }
                }
            }
        });

        const formatted = followers.map((f) => f.follower);

        res.status(200).json({
            success: true,
            message: `Followers of user ${userId}`,
            data: formatted,
        })
        return;
    } catch (error) {
        console.error("Get Followers Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

export const getUserFollowing = async (req: Request, res: Response) => {
    const { id: userId } = req.params

    try {
        const followings = await prisma.followers.findMany({
            where: { followerId: userId },
            include: {
                following: {
                    select: {
                        id: true,
                        username: true,
                        fullname: true,
                        email: true,
                        profile_image: true,
                        banner: true,
                        bio: true,
                    }
                }
            }
        });
        
        const formatted = followings.map((f) => f.following);

        res.status(200).json({
            success: true,
            message: `Users followed by user ${userId}`,
            data: formatted,
        })
        return;
    } catch (error) {
        console.error("Get Following Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

export const searchUsers = async (req: Request, res: Response) => {
    const { search } = req.query;
    const searchQuery = search as string;

    if (!searchQuery || searchQuery.trim().length < 3) {
        res.status(400).json({
            success: false,
            message: "Search query is required and must be at least 3 characters.",
        });
        return;
    }

    try {
        const users = await prisma.users.findMany({
            where:{
                OR: [
                    { username: { contains: search as string, mode: "insensitive" } },
                    { fullname: { contains: search as string, mode: "insensitive" } },
                ],
            },
            select:{
                id: true,
                username: true,
                fullname: true,
                email: true,
                profile_image: true,
                banner: true,
                bio: true
            }
        });

        if (users.length === 0) {
            res.status(404).json({
                success: false,
                message: "No users found.",
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: `Search results for search: ${search}`,
            data: users,
        });
        return;

    } catch (error) {
        console.error("Search Users Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}