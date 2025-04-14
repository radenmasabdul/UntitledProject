import express  from "express";
import { findUsers, findUserById, updateUser, deleteUser } from "@/controllers/user/user";
import { verifyToken } from "@/middlewares/auth/authMiddleware";

const userRouter = express.Router();

userRouter.get("/", verifyToken, findUsers);
userRouter.get("/:id", verifyToken, findUserById);
userRouter.put("/:id", verifyToken, updateUser);
userRouter.delete("/:id", verifyToken, deleteUser);

export default userRouter;