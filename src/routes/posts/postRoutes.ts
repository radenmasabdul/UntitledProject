import express  from "express";
import { getAllPosts, createPost } from "@/controllers/posts/post";
import { verifyToken } from "@/middlewares/auth/authMiddleware";
import upload from "@/middlewares/upload/upload";

const postRouter = express.Router();

postRouter.get("/", verifyToken, getAllPosts);
postRouter.post("/", verifyToken, upload.single("media"), createPost);

export default postRouter;