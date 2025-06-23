"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const post_1 = require("@/controllers/posts/post");
const authMiddleware_1 = require("@/middlewares/auth/authMiddleware");
const upload_1 = __importDefault(require("@/middlewares/upload/upload"));
const postRouter = express_1.default.Router();
postRouter.get("/", authMiddleware_1.verifyToken, post_1.getAllPosts);
postRouter.get("/:id", authMiddleware_1.verifyToken, post_1.getPostByid);
postRouter.post("/", authMiddleware_1.verifyToken, upload_1.default.single("media"), post_1.createPost);
postRouter.delete("/:id", authMiddleware_1.verifyToken, post_1.deletePost);
postRouter.put("/:id", authMiddleware_1.verifyToken, upload_1.default.single("media"), post_1.updatePost);
exports.default = postRouter;
