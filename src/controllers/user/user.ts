import { Request, Response } from "express";
import prisma from "@/configs/database";
import { userSelectFields } from "@/utils/helpers/prismaSelect";
import { successResponse, errorResponse } from "@/utils/helpers/response";
import { isValidId } from "@/middlewares/validate/validateObjectId";

export const findUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.users.findMany({
      select: userSelectFields,
      orderBy: { createdAt: "desc" },
    });
    successResponse(res, "Get all users successfully", users);
  } catch (error) {
    console.error("Get User Error:", error);
    errorResponse(res, "Internal server error");
  }
};

export const findUserById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  if (!isValidId(id)) {
    errorResponse(res, "Invalid user ID", 400);
    return;
  }

  try {
    const user = await prisma.users.findUnique({ where: { id }, select: userSelectFields });
    if (!user) {
      errorResponse(res, `User with ID ${id} not found`, 404);
      return;
    }
    successResponse(res, `User with ID ${id} fetched successfully`, user);
  } catch (error) {
    console.error("Find User Error:", error);
    errorResponse(res, "Internal server error");
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const loggedInUserId = req.user?.id;

  if (id !== loggedInUserId) {
    errorResponse(res, "Unauthorized", 403);
    return;
  }
  if (!isValidId(id)) {
    errorResponse(res, "Invalid user ID", 400);
    return;
  }

  try {
    const existingUser = await prisma.users.findUnique({ where: { id } });
    if (!existingUser) {
      errorResponse(res, `User with ID ${id} not found`, 404);
      return;
    }

    const updatedUser = await prisma.users.update({ where: { id }, data: req.body });
    successResponse(res, "User updated successfully", updatedUser);
  } catch (error) {
    console.error("Update User Error:", error);
    errorResponse(res, "Internal server error");
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const loggedInUserId = req.user.id;

  if (!isValidId(loggedInUserId)) {
    errorResponse(res, "Invalid user ID", 400);
    return;
  }

  try {
    const existingUser = await prisma.users.findUnique({ where: { id: loggedInUserId } });
    if (!existingUser) {
      errorResponse(res, `User with ID ${loggedInUserId} not found`, 400);
      return;
    }

    const deleteDependencies = [
      prisma.comment.deleteMany({ where: { usersId: loggedInUserId } }),
      prisma.posts.deleteMany({ where: { usersId: loggedInUserId } }),
      prisma.like.deleteMany({ where: { usersId: loggedInUserId } }),
      prisma.rePosts.deleteMany({ where: { usersId: loggedInUserId } }),
      prisma.notification.deleteMany({ where: { usersId: loggedInUserId } }),
      prisma.followers.deleteMany({ where: { followerId: loggedInUserId } }),
      prisma.followers.deleteMany({ where: { followingId: loggedInUserId } }),
      prisma.friends.deleteMany({ where: { usersId: loggedInUserId } }),
      prisma.friends.deleteMany({ where: { friendId: loggedInUserId } }),
    ];

    await Promise.all(deleteDependencies);
    await prisma.users.delete({ where: { id: loggedInUserId } });

    successResponse(res, `User with ID ${loggedInUserId} and related data deleted successfully`);
  } catch (error) {
    console.error("Delete User Error:", error);
    errorResponse(res, "Internal server error");
  }
};

export const updateProfileImage = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const loggedInUserId = req.user?.id;
  const file = req.file;

  if (!file) {
    errorResponse(res, "No image file uploaded", 400);
    return;
  }
  if (id !== loggedInUserId) {
    errorResponse(res, "Unauthorized", 403);
    return;
  }

  try {
    const updatedUser = await prisma.users.update({
      where: { id },
      data: { profile_image: file.filename },
    });
    successResponse(res, "Profile image updated successfully", updatedUser);
  } catch (error) {
    console.error("Update Profile Image Error:", error);
    errorResponse(res, "Internal server error");
  }
};

export const updateBanner = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const loggedInUserId = req.user?.id;
  const file = req.file;

  if (!file) {
    errorResponse(res, "No banner image uploaded", 400);
    return;
  }
  if (id !== loggedInUserId) {
    errorResponse(res, "Unauthorized", 403);
    return;
  }

  try {
    const updatedUser = await prisma.users.update({
      where: { id },
      data: { banner: file.filename },
    });
    successResponse(res, "Banner updated successfully", updatedUser);
  } catch (error) {
    console.error("Update Banner Error:", error);
    errorResponse(res, "Internal server error");
  }
};

export const followUser = async (req: Request, res: Response): Promise<void> => {
  const { id: followingId } = req.params;
  const followerId = req.user?.id;

  if (!followerId || !isValidId(followingId)) {
    errorResponse(res, "Unauthorized", 401);
    return;
  }
  if (followerId === followingId) {
    errorResponse(res, "You cannot follow yourself.", 400);
    return;
  }

  try {
    const userExists = await prisma.users.findUnique({ where: { id: followingId } });
    if (!userExists) {
      errorResponse(res, `User with ID ${followingId} not found`, 404);
      return;
    }

    const alreadyFollowing = await prisma.followers.findFirst({
      where: { followerId, followingId },
    });
    if (alreadyFollowing) {
      errorResponse(res, "You are already following this user.", 400);
      return;
    }

    const follow = await prisma.followers.create({ data: { followerId, followingId } });
    successResponse(res, `You are now following user with ID ${followingId}`, follow, 201);
  } catch (error) {
    console.error("Follow User Error:", error);
    errorResponse(res, "Internal server error");
  }
};

export const unfollowUser = async (req: Request, res: Response): Promise<void> => {
  const { id: followingId } = req.params;
  const followerId = req.user?.id;

  if (!followerId || !isValidId(followingId)) {
    errorResponse(res, "Unauthorized", 401);
    return;
  }
  if (followerId === followingId) {
    errorResponse(res, "You cannot unfollow yourself.", 400);
    return;
  }

  try {
    const existingFollow = await prisma.followers.findFirst({
      where: { followerId, followingId },
    });
    if (!existingFollow) {
      errorResponse(res, "You are not following this user.", 400);
      return;
    }

    await prisma.followers.delete({ where: { id: existingFollow.id } });
    successResponse(res, `You have unfollowed user with ID ${followingId}`);
  } catch (error) {
    console.error("Unfollow User Error:", error);
    errorResponse(res, "Internal server error");
  }
};

export const getUserFollowers = async (req: Request, res: Response): Promise<void> => {
  const { id: userId } = req.params;

  if (!isValidId(userId)) {
    errorResponse(res, "Invalid user ID", 400);
    return;
  }

  try {
    const followers = await prisma.followers.findMany({
      where: { followingId: userId },
      include: { follower: { select: userSelectFields } },
    });

    const formatted = followers.map((f) => f.follower);
    successResponse(res, `Followers of user ${userId}`, formatted);
  } catch (error) {
    console.error("Get Followers Error:", error);
    errorResponse(res, "Internal server error");
  }
};

export const getUserFollowing = async (req: Request, res: Response): Promise<void> => {
  const { id: userId } = req.params;

  if (!isValidId(userId)) {
    errorResponse(res, "Invalid user ID", 400);
    return;
  }

  try {
    const followings = await prisma.followers.findMany({
      where: { followerId: userId },
      include: { following: { select: userSelectFields } },
    });

    const formatted = followings.map((f) => f.following);
    successResponse(res, `Users followed by user ${userId}`, formatted);
  } catch (error) {
    console.error("Get Following Error:", error);
    errorResponse(res, "Internal server error");
  }
};

export const searchUsers = async (req: Request, res: Response): Promise<void> => {
  const { search } = req.query;
  const searchQuery = String(search || "").trim();

  if (searchQuery.length < 3) {
    errorResponse(res, "Search query must be at least 3 characters.", 400);
    return;
  }

  try {
    const users = await prisma.users.findMany({
      where: {
        OR: [
          { username: { contains: searchQuery, mode: "insensitive" } },
          { fullname: { contains: searchQuery, mode: "insensitive" } },
        ],
      },
      select: userSelectFields,
    });

    if (!users.length) {
      errorResponse(res, "No users found.", 404);
      return;
    }

    successResponse(res, `Search results for: ${searchQuery}`, users);
  } catch (error) {
    console.error("Search Users Error:", error);
    errorResponse(res, "Internal server error");
  }
};