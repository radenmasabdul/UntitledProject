import express from "express";
import authRouter from "./auth/authRoutes";
import userRouter from "./user/userRoutes";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);

export default router;