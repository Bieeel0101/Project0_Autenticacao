export const CONFIG = {
  JWT_SECRET: process.env.JWT_SECRET || "change_this_secret_in_prod",
  ACCESS_TTL: "15m",
  REFRESH_DAYS: 30,
  ORIGIN: process.env.ORIGIN || "http://localhost:3000",
};
