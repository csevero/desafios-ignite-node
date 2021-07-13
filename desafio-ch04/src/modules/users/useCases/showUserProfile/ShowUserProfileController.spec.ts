import request from "supertest";
import createConnection from "../../../../database/index";
import { app } from "../../../../app";
import { Connection } from "typeorm";

let connection: Connection;

describe("Show User Profile", () => {
  beforeAll(async () => {
    connection = await createConnection();

    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("/profile - GET", async () => {
    await request(app)
      .post("/api/v1/users")
      .send({ name: "carlos", email: "severo@email.com", password: "1234" });

    const user = await request(app)
      .post("/api/v1/sessions")
      .send({ email: "severo@email.com", password: "1234" });

    const { token } = user.body;

    console.log(token);

    const result = await request(app)
      .get("/api/v1/profile")
      .set({ Authorization: `Bearer ${token}` });

    console.log(result.body);

    expect(result.status).toBe(200);
    expect(result.body).toHaveProperty("id");
  });
});
