import { body } from "express-validator";
import prisma from "../../../configs/database";

// validasi untuk Create atau Update User
export const validateUser = [
    body("username")
        .notEmpty().withMessage("Username is required")
        .custom(async (value, { req }) => {
            const userId = req.params?.id; // pastikan params ada
            const existingUser = await prisma.users.findUnique({ where: { username: value } });

            if (existingUser && existingUser.id !== userId) {
                throw new Error("Username already exists");
            }
            return true;
        }),
    body("fullname").notEmpty().withMessage("Fullname is required"),
    body("email")
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Email is invalid")
        .custom(async (value, { req }) => {
            const userId = req.params?.id; // pastikan params ada
            const existingUser = await prisma.users.findUnique({ where: { email: value } });

            if (existingUser && existingUser.id !== userId) {
                throw new Error("Email already exists");
            }
            return true;
        }),
    body("password")
        .optional() // password bisa dikosongkan saat update
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
        .bail()
        .custom((value, { req }) => {
            if (req.method === "POST" && !value) {
                throw new Error("Password is required when creating a user");
            }
            return true;
        }),
];