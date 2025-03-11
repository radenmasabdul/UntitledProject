import express from "express";
import authRouter from "./auth/authRoutes";

const router = express.Router();

router.use("/auth", authRouter);

export default router;