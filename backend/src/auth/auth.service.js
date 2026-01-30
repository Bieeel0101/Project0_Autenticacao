import jwt from "jsonwebtoken";
import argon2 from "argon2";
import crypto from "crypto";
import { v4 as uuid } from "uuid";
import { CONFIG } from "../config.js";

export const hashPassword = (plain) =>
  argon2.hash(plain, { type: argon2.argon2id });
export const verifyPassword = (hash, plain) => argon2.verify(hash, plain);

export const signAccess = (user) =>
  jwt.sign({ sub: user.id, email: user.email }, CONFIG.JWT_SECRET, {
    expiresIn: CONFIG.ACCESS_TTL,
  });

export function generateRefresh() {
  return uuid() + "." + crypto.randomBytes(64).toString("hex");
}

export function hashRefresh(refreshToken) {
  return crypto.createHash("sha256").update(refreshToken).digest("hex");
}
