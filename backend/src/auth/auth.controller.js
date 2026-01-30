import { db } from "../db.js";
import { CONFIG } from "../config.js";
import {
  hashPassword,
  verifyPassword,
  signAccess,
  generateRefresh,
  hashRefresh,
} from "./auth.service.js";

export const signup = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Dados incompletos" });
  if (db.findUserByEmail(email))
    return res.status(400).json({ error: "Email já cadastrado" });

  const passwordHash = await hashPassword(password);
  const user = { id: String(Date.now()), email, passwordHash };
  db.createUser(user);
  res.status(201).json({ message: "Usuário criado" });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = db.findUserByEmail(email);
  if (!user) return res.status(401).json({ error: "Credenciais inválidas" });
  if (!(await verifyPassword(user.passwordHash, password)))
    return res.status(401).json({ error: "Credenciais inválidas" });

  const access = signAccess(user);
  const refresh = generateRefresh();
  const refreshHash = hashRefresh(refresh);

  db.saveRefresh({
    id: refreshHash,
    userId: user.id,
    expires: Date.now() + CONFIG.REFRESH_DAYS * 24 * 3600 * 1000,
  });

  res.cookie("refresh", refresh, {
    httpOnly: true,
    secure: false, // set true in production with HTTPS
    sameSite: "lax",
    path: "/auth/refresh",
    maxAge: CONFIG.REFRESH_DAYS * 24 * 3600 * 1000,
  });

  res.json({ access });
};

export const refresh = async (req, res) => {
  const refreshToken = req.cookies.refresh;
  if (!refreshToken) return res.status(401).send();

  const refreshHash = hashRefresh(refreshToken);
  const record = db.findRefreshByHash(refreshHash);
  if (!record) return res.status(401).send();
  if (record.expires < Date.now()) {
    db.removeRefreshByHash(refreshHash);
    return res.status(401).send();
  }

  // rotate
  db.removeRefreshByHash(refreshHash);
  const newRefresh = generateRefresh();
  const newHash = hashRefresh(newRefresh);
  db.saveRefresh({
    id: newHash,
    userId: record.userId,
    expires: Date.now() + CONFIG.REFRESH_DAYS * 24 * 3600 * 1000,
  });

  const user = db.findUserById(record.userId);
  const access = signAccess(user);

  res.cookie("refresh", newRefresh, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/auth/refresh",
    maxAge: CONFIG.REFRESH_DAYS * 24 * 3600 * 1000,
  });

  res.json({ access });
};

export const logout = async (req, res) => {
  const refreshToken = req.cookies.refresh;
  if (refreshToken) {
    const refreshHash = hashRefresh(refreshToken);
    db.removeRefreshByHash(refreshHash);
  }
  res.clearCookie("refresh", { path: "/auth/refresh" });
  res.json({ ok: true });
};
