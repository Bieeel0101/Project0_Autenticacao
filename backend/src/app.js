import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import { authRouter } from "./auth/auth.routes.js";
import { protectedRouter } from "./protected.routes.js";
import { CONFIG } from "./config.js";

export const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(cors({ origin: CONFIG.ORIGIN, credentials: true }));

app.use("/auth", authRouter);
app.use("/api", protectedRouter);

app.get("/", (req, res) => res.send("API up"));
