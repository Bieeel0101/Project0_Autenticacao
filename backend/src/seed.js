import { db } from "./db.js";
import { hashPassword } from "./auth/auth.service.js";

async function seed() {
  const hashed = await hashPassword("password123");
  db.createUser({ id: "1", email: "admin@example.com", passwordHash: hashed });
  console.log("Seed criado: admin@example.com / password123");
}

seed();
