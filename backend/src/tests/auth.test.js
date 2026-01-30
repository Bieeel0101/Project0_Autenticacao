import request from "supertest";
import { app } from "../app.js";
import { db } from "../db.js";

describe("Auth flow", () => {
  beforeEach(() => {
    // reset db
    db.users.length = 0;
    db.refreshTokens.length = 0;
  });

  test("signup -> login -> access protected", async () => {
    await request(app)
      .post("/auth/signup")
      .send({ email: "t@t.com", password: "123456" })
      .expect(201);

    const login = await request(app)
      .post("/auth/login")
      .send({ email: "t@t.com", password: "123456" })
      .expect(200);
    expect(login.body.access).toBeDefined();
    const token = login.body.access;

    const res = await request(app)
      .get("/api/profile")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    expect(res.body.email).toBe("t@t.com");
  });

  test("refresh rotates token", async () => {
    await request(app)
      .post("/auth/signup")
      .send({ email: "t2@t.com", password: "123456" })
      .expect(201);
    const login = await request(app)
      .post("/auth/login")
      .send({ email: "t2@t.com", password: "123456" })
      .expect(200);

    const cookie = login.headers["set-cookie"][0].split(";")[0];

    // call refresh using cookie
    const refresh = await request(app)
      .post("/auth/refresh")
      .set("Cookie", cookie)
      .expect(200);
    expect(refresh.body.access).toBeDefined();

    // old refresh shouldn't work anymore
    const oldCookie = cookie;
    await request(app)
      .post("/auth/refresh")
      .set("Cookie", oldCookie)
      .expect(401);
  });
});
