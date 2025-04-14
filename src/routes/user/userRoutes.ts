import express  from "express";
import { findUsers } from "@/controllers/user/findUser";
import { verifyToken } from "@/middlewares/auth/authMiddleware";

const userRouter = express.Router();

userRouter.get("/", verifyToken, findUsers);

export default userRouter;