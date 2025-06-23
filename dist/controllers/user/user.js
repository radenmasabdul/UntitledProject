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
exports.searchUsers = exports.getUserFollowing = exports.getUserFollowers = exports.unfollowUser = exports.followUser = exports.updateBanner = exports.updateProfileImage = exports.deleteUser = exports.updateUser = exports.findUserById = exports.findUsers = void 0;
const database_1 = __importDefault(require("@/configs/database"));
const prismaSelect_1 = require("@/utils/helpers/prismaSelect");
const response_1 = require("@/utils/helpers/response");
const validateObjectId_1 = require("@/middlewares/validate/validateObjectId");
const findUsers = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield database_1.default.users.findMany({
            select: prismaSelect_1.userSelectFields,
            orderBy: { createdAt: "desc" },
        });
        (0, response_1.successResponse)(res, "Get all users successfully", users);
    }
    catch (error) {
        console.error("Get User Error:", error);
        (0, response_1.errorResponse)(res, "Internal server error");
    }
});
exports.findUsers = findUsers;
const findUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!(0, validateObjectId_1.isValidId)(id)) {
        (0, response_1.errorResponse)(res, "Invalid user ID", 400);
        return;
    }
    try {
        const user = yield database_1.default.users.findUnique({ where: { id }, select: prismaSelect_1.userSelectFields });
        if (!user) {
            (0, response_1.errorResponse)(res, `User with ID ${id} not found`, 404);
            return;
        }
        (0, response_1.successResponse)(res, `User with ID ${id} fetched successfully`, user);
    }
    catch (error) {
        console.error("Find User Error:", error);
        (0, response_1.errorResponse)(res, "Internal server error");
    }
});
exports.findUserById = findUserById;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const loggedInUserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (id !== loggedInUserId) {
        (0, response_1.errorResponse)(res, "Unauthorized", 403);
        return;
    }
    if (!(0, validateObjectId_1.isValidId)(id)) {
        (0, response_1.errorResponse)(res, "Invalid user ID", 400);
        return;
    }
    try {
        const existingUser = yield database_1.default.users.findUnique({ where: { id } });
        if (!existingUser) {
            (0, response_1.errorResponse)(res, `User with ID ${id} not found`, 404);
            return;
        }
        const updatedUser = yield database_1.default.users.update({ where: { id }, data: req.body });
        (0, response_1.successResponse)(res, "User updated successfully", updatedUser);
    }
    catch (error) {
        console.error("Update User Error:", error);
        (0, response_1.errorResponse)(res, "Internal server error");
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loggedInUserId = req.user.id;
    if (!(0, validateObjectId_1.isValidId)(loggedInUserId)) {
        (0, response_1.errorResponse)(res, "Invalid user ID", 400);
        return;
    }
    try {
        const existingUser = yield database_1.default.users.findUnique({ where: { id: loggedInUserId } });
        if (!existingUser) {
            (0, response_1.errorResponse)(res, `User with ID ${loggedInUserId} not found`, 400);
            return;
        }
        const deleteDependencies = [
            database_1.default.comment.deleteMany({ where: { usersId: loggedInUserId } }),
            database_1.default.posts.deleteMany({ where: { usersId: loggedInUserId } }),
            database_1.default.like.deleteMany({ where: { usersId: loggedInUserId } }),
            database_1.default.rePosts.deleteMany({ where: { usersId: loggedInUserId } }),
            database_1.default.notification.deleteMany({ where: { usersId: loggedInUserId } }),
            database_1.default.followers.deleteMany({ where: { followerId: loggedInUserId } }),
            database_1.default.followers.deleteMany({ where: { followingId: loggedInUserId } }),
            database_1.default.friends.deleteMany({ where: { usersId: loggedInUserId } }),
            database_1.default.friends.deleteMany({ where: { friendId: loggedInUserId } }),
        ];
        yield Promise.all(deleteDependencies);
        yield database_1.default.users.delete({ where: { id: loggedInUserId } });
        (0, response_1.successResponse)(res, `User with ID ${loggedInUserId} and related data deleted successfully`);
    }
    catch (error) {
        console.error("Delete User Error:", error);
        (0, response_1.errorResponse)(res, "Internal server error");
    }
});
exports.deleteUser = deleteUser;
const updateProfileImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const loggedInUserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const file = req.file;
    if (!file) {
        (0, response_1.errorResponse)(res, "No image file uploaded", 400);
        return;
    }
    if (id !== loggedInUserId) {
        (0, response_1.errorResponse)(res, "Unauthorized", 403);
        return;
    }
    try {
        const updatedUser = yield database_1.default.users.update({
            where: { id },
            data: { profile_image: file.filename },
        });
        (0, response_1.successResponse)(res, "Profile image updated successfully", updatedUser);
    }
    catch (error) {
        console.error("Update Profile Image Error:", error);
        (0, response_1.errorResponse)(res, "Internal server error");
    }
});
exports.updateProfileImage = updateProfileImage;
const updateBanner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const loggedInUserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const file = req.file;
    if (!file) {
        (0, response_1.errorResponse)(res, "No banner image uploaded", 400);
        return;
    }
    if (id !== loggedInUserId) {
        (0, response_1.errorResponse)(res, "Unauthorized", 403);
        return;
    }
    try {
        const updatedUser = yield database_1.default.users.update({
            where: { id },
            data: { banner: file.filename },
        });
        (0, response_1.successResponse)(res, "Banner updated successfully", updatedUser);
    }
    catch (error) {
        console.error("Update Banner Error:", error);
        (0, response_1.errorResponse)(res, "Internal server error");
    }
});
exports.updateBanner = updateBanner;
const followUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id: followingId } = req.params;
    const followerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!followerId || !(0, validateObjectId_1.isValidId)(followingId)) {
        (0, response_1.errorResponse)(res, "Unauthorized", 401);
        return;
    }
    if (followerId === followingId) {
        (0, response_1.errorResponse)(res, "You cannot follow yourself.", 400);
        return;
    }
    try {
        const userExists = yield database_1.default.users.findUnique({ where: { id: followingId } });
        if (!userExists) {
            (0, response_1.errorResponse)(res, `User with ID ${followingId} not found`, 404);
            return;
        }
        const alreadyFollowing = yield database_1.default.followers.findFirst({
            where: { followerId, followingId },
        });
        if (alreadyFollowing) {
            (0, response_1.errorResponse)(res, "You are already following this user.", 400);
            return;
        }
        const follow = yield database_1.default.followers.create({ data: { followerId, followingId } });
        (0, response_1.successResponse)(res, `You are now following user with ID ${followingId}`, follow, 201);
    }
    catch (error) {
        console.error("Follow User Error:", error);
        (0, response_1.errorResponse)(res, "Internal server error");
    }
});
exports.followUser = followUser;
const unfollowUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id: followingId } = req.params;
    const followerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!followerId || !(0, validateObjectId_1.isValidId)(followingId)) {
        (0, response_1.errorResponse)(res, "Unauthorized", 401);
        return;
    }
    if (followerId === followingId) {
        (0, response_1.errorResponse)(res, "You cannot unfollow yourself.", 400);
        return;
    }
    try {
        const existingFollow = yield database_1.default.followers.findFirst({
            where: { followerId, followingId },
        });
        if (!existingFollow) {
            (0, response_1.errorResponse)(res, "You are not following this user.", 400);
            return;
        }
        yield database_1.default.followers.delete({ where: { id: existingFollow.id } });
        (0, response_1.successResponse)(res, `You have unfollowed user with ID ${followingId}`);
    }
    catch (error) {
        console.error("Unfollow User Error:", error);
        (0, response_1.errorResponse)(res, "Internal server error");
    }
});
exports.unfollowUser = unfollowUser;
const getUserFollowers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: userId } = req.params;
    if (!(0, validateObjectId_1.isValidId)(userId)) {
        (0, response_1.errorResponse)(res, "Invalid user ID", 400);
        return;
    }
    try {
        const followers = yield database_1.default.followers.findMany({
            where: { followingId: userId },
            include: { follower: { select: prismaSelect_1.userSelectFields } },
        });
        const formatted = followers.map((f) => f.follower);
        (0, response_1.successResponse)(res, `Followers of user ${userId}`, formatted);
    }
    catch (error) {
        console.error("Get Followers Error:", error);
        (0, response_1.errorResponse)(res, "Internal server error");
    }
});
exports.getUserFollowers = getUserFollowers;
const getUserFollowing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: userId } = req.params;
    if (!(0, validateObjectId_1.isValidId)(userId)) {
        (0, response_1.errorResponse)(res, "Invalid user ID", 400);
        return;
    }
    try {
        const followings = yield database_1.default.followers.findMany({
            where: { followerId: userId },
            include: { following: { select: prismaSelect_1.userSelectFields } },
        });
        const formatted = followings.map((f) => f.following);
        (0, response_1.successResponse)(res, `Users followed by user ${userId}`, formatted);
    }
    catch (error) {
        console.error("Get Following Error:", error);
        (0, response_1.errorResponse)(res, "Internal server error");
    }
});
exports.getUserFollowing = getUserFollowing;
const searchUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { search } = req.query;
    const searchQuery = String(search || "").trim();
    if (searchQuery.length < 3) {
        (0, response_1.errorResponse)(res, "Search query must be at least 3 characters.", 400);
        return;
    }
    try {
        const users = yield database_1.default.users.findMany({
            where: {
                OR: [
                    { username: { contains: searchQuery, mode: "insensitive" } },
                    { fullname: { contains: searchQuery, mode: "insensitive" } },
                ],
            },
            select: prismaSelect_1.userSelectFields,
        });
        if (!users.length) {
            (0, response_1.errorResponse)(res, "No users found.", 404);
            return;
        }
        (0, response_1.successResponse)(res, `Search results for: ${searchQuery}`, users);
    }
    catch (error) {
        console.error("Search Users Error:", error);
        (0, response_1.errorResponse)(res, "Internal server error");
    }
});
exports.searchUsers = searchUsers;
