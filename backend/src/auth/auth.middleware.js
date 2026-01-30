import jwt from "jsonwebtoken";
import { CONFIG } from "../config.js";

export function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).send();
  const token = auth.split(" ")[1];
  try {
    const payload = jwt.verify(token, CONFIG.JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).send();
  }
}
