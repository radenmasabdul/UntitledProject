import express  from "express";
import { findUsers, findUserById, updateUser, deleteUser, updateProfileImage, updateBanner, followUser, unfollowUser, getUserFollowers, getUserFollowing, searchUsers } from "@/controllers/user/user";
import { verifyToken } from "@/middlewares/auth/authMiddleware";
import upload from "@/middlewares/upload/upload";

const userRouter = express.Router();

userRouter.get("/", verifyToken, findUsers);
userRouter.get("/search", verifyToken, searchUsers);
userRouter.get("/:id", verifyToken, findUserById);
userRouter.put("/:id", verifyToken, updateUser);
userRouter.delete("/me", verifyToken, deleteUser);
userRouter.put("/:id/image", verifyToken, upload.single("image"), updateProfileImage);
userRouter.put("/:id/banner", verifyToken, upload.single("banner"), updateBanner);
userRouter.post("/:id/follow", verifyToken, followUser);
userRouter.post("/:id/unfollow", verifyToken, unfollowUser);
userRouter.get("/:id/followers", verifyToken, getUserFollowers);
userRouter.get("/:id/following", verifyToken, getUserFollowing);

export default userRouter;