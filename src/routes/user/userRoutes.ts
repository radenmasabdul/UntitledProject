import express  from "express";
import { findUsers, findUserById, updateUser, deleteUser, updateProfileImage, updateBanner, followUser, unfollowUser } from "@/controllers/user/user";
import { verifyToken } from "@/middlewares/auth/authMiddleware";
import upload from "@/middlewares/upload/upload";

const userRouter = express.Router();

userRouter.get("/", verifyToken, findUsers);
userRouter.get("/:id", verifyToken, findUserById);
userRouter.put("/:id", verifyToken, updateUser);
userRouter.delete("/:id", verifyToken, deleteUser);
userRouter.put("/:id/image", verifyToken, upload.single("image"), updateProfileImage);
userRouter.put("/:id/banner", verifyToken, upload.single("banner"), updateBanner);
userRouter.post("/:id/follow", verifyToken, followUser);
userRouter.post("/:id/unfollow", verifyToken, unfollowUser);

export default userRouter;