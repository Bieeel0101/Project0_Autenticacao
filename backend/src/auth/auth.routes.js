import express from "express";
import { signup, login, refresh, logout } from "./auth.controller.js";

export const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/refresh", refresh);
authRouter.post("/logout", logout);
