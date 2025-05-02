import express  from "express";
import { getAllPosts, getPostByid, createPost, deletePost } from "@/controllers/posts/post";
import { verifyToken } from "@/middlewares/auth/authMiddleware";
import upload from "@/middlewares/upload/upload";

const postRouter = express.Router();

postRouter.get("/", verifyToken, getAllPosts);
postRouter.get("/:id", verifyToken, getPostByid);
postRouter.post("/", verifyToken, upload.single("media"), createPost);
postRouter.delete("/:id", verifyToken, deletePost);

export default postRouter;