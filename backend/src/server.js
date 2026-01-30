import { app } from "./app.js";
import { db } from "./db.js";
import { hashPassword } from "./auth/auth.service.js";

const PORT = process.env.PORT || 4000;

// Seed do banco de dados em memória
async function initDatabase() {
  if (db.users.length === 0) {
    const hashed = await hashPassword("password123");
    db.createUser({ id: "1", email: "admin@example.com", passwordHash: hashed });
    console.log("Seed criado: admin@example.com / password123");
  }
}

initDatabase().then(() => {
  app.listen(PORT, () => console.log("Server running on", PORT));
});
