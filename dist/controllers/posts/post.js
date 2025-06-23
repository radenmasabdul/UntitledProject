"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePost = exports.deletePost = exports.createPost = exports.getPostByid = exports.getAllPosts = void 0;
const database_1 = __importDefault(require("@/configs/database"));
const getAllPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield database_1.default.posts.findMany({
            orderBy: {
                createdAt: "desc",
            },
            include: {
                users: {
                    select: {
                        id: true,
                        username: true,
                        fullname: true,
                        email: true,
                        profile_image: true,
                        banner: true,
                        bio: true,
                    }
                },
                _count: {
                    select: {
                        comments: true,
                        likes: true,
                    },
                },
            },
        });
        res.status(200).json({
            success: true,
            message: "All posts retrieved successfully",
            data: posts,
        });
        return;
    }
    catch (error) {
        console.error("Get User Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
exports.getAllPosts = getAllPosts;
const getPostByid = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const post = yield database_1.default.posts.findUnique({
            where: {
                id: id,
            },
            include: {
                users: {
                    select: {
                        id: true,
                        username: true,
                        fullname: true,
                        email: true,
                        profile_image: true,
                        banner: true,
                        bio: true,
                    }
                },
                _count: {
                    select: {
                        comments: true,
                        likes: true,
                    },
                },
            },
        });
        if (!post) {
            res.status(404).json({
                success: false,
                message: "Post not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Post retrieved successfully",
            data: post,
        });
        return;
    }
    catch (error) {
        console.error("Get Post Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
exports.getPostByid = getPostByid;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { contentText, usersId, userId } = req.body;
    const loggedInUserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const file = req.file;
    if (!loggedInUserId) {
        res.status(400).json({
            success: false,
            message: "User ID is required",
        });
        return;
    }
    if (userId || usersId) {
        res.status(403).json({
            success: false,
            message: "You are not authorized to create this post",
        });
        return;
    }
    // Tentukan mediaType berdasarkan file yang dikirim
    let mediaType = "TEXT"; // Default ke text jika tidak ada file
    if (file) {
        const mimetype = file.mimetype;
        switch (true) {
            case mimetype.startsWith("image/"):
                mediaType = "PHOTO";
                break;
            case mimetype.startsWith("video/"):
                mediaType = "VIDEO";
                break;
            case mimetype.startsWith("audio/"):
                mediaType = "MUSIC";
                break;
            default:
                res.status(400).json({
                    success: false,
                    message: "Unsupported file type",
                });
                return;
        }
    }
    try {
        const newPost = yield database_1.default.posts.create({
            data: {
                usersId: loggedInUserId,
                contentText: contentText || null,
                contentImage: file ? file.filename : null,
                mediaType,
            },
        });
        res.status(201).json({
            success: true,
            message: "Post created successfully",
            data: newPost,
        });
    }
    catch (error) {
        console.error("Create Post Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
exports.createPost = createPost;
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const loggedInUserId = req.user.id;
    try {
        const existingPost = yield database_1.default.posts.findUnique({
            where: { id },
        });
        if (!existingPost) {
            res.status(404).json({
                success: false,
                message: `Post with ID ${id} not found`,
            });
            return;
        }
        if (existingPost.usersId !== loggedInUserId) {
            res.status(403).json({
                success: false,
                message: "You are not authorized to delete this post",
            });
            return;
        }
        yield database_1.default.posts.delete({
            where: { id },
        });
        res.status(200).json({
            success: true,
            message: "Post deleted successfully",
        });
    }
    catch (error) {
        console.error("Delete Post Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
exports.deletePost = deletePost;
const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const { contentText } = req.body;
    const loggedInUserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const existingPost = yield database_1.default.posts.findUnique({
            where: { id },
        });
        if (!existingPost) {
            res.status(404).json({
                success: false,
                message: `Post with ID ${id} not found`,
            });
            return;
        }
        if (existingPost.usersId !== loggedInUserId) {
            res.status(403).json({
                success: false,
                message: "You are not authorized to edit this post",
            });
            return;
        }
        const updatedPost = yield database_1.default.posts.update({
            where: { id },
            data: {
                contentText: contentText || existingPost.contentText,
            },
        });
        res.status(200).json({
            success: true,
            message: "Post updated successfully",
            data: updatedPost,
        });
    }
    catch (error) {
        console.error("Update Post Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
exports.updatePost = updatePost;
