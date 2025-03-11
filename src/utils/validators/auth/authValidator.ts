import { body } from "express-validator";
import prisma from "@/configs/database";

// validasi untuk Register
export const validateRegister = [
    body("username")
        .notEmpty().withMessage("Username is required")
        .custom(async (value) => {
            const user = await prisma.users.findUnique({ where: { username: value } });
            if (user) {
                throw new Error("Username already exists");
            }
            return true;
        }),
    body("fullname").notEmpty().withMessage("Fullname is required"),
    body("email")
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Email is invalid")
        .custom(async (value) => {
            const user = await prisma.users.findUnique({ where: { email: value } });
            if (user) {
                throw new Error("Email already exists");
            }
            return true;
        }),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
];

// validasi untuk Login (bisa pakai email atau username)
export const validateLogin = [
    body("identifier")
        .notEmpty().withMessage("Email or username is required"),
    body("password")
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
];