import express from "express";
import authRouter from "./auth/authRoutes";
import userRouter from "./user/userRoutes";
import postRouter from "./posts/postRoutes";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/posts", postRouter);

export default router;