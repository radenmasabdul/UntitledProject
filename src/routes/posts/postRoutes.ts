import express  from "express";
import { getAllPosts, getPostByid, createPost, deletePost, updatePost } from "@/controllers/posts/post";
import { verifyToken } from "@/middlewares/auth/authMiddleware";
import upload from "@/middlewares/upload/upload";

const postRouter = express.Router();

postRouter.get("/", verifyToken, getAllPosts);
postRouter.get("/:id", verifyToken, getPostByid);
postRouter.post("/", verifyToken, upload.single("media"), createPost);
postRouter.delete("/:id", verifyToken, deletePost);
postRouter.put("/:id", verifyToken, upload.single("media"), updatePost);

export default postRouter;