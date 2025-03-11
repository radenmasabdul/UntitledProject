import express  from "express";
import { register } from "@/controllers/auth/register";
import { login } from "@/controllers/auth/login";
import { validateLogin, validateRegister } from "@/utils/validators/auth/authValidator";

const authRouter = express.Router();

authRouter.post("/register", validateRegister, register);
authRouter.post("/login", validateLogin, login);

export default authRouter;