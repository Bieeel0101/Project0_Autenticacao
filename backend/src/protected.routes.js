import express from "express";
import { authMiddleware } from "./auth/auth.middleware.js";

export const protectedRouter = express.Router();
protectedRouter.get("/profile", authMiddleware, (req, res) => {
  res.json({ userId: req.user.sub, email: req.user.email });
});
