import request from "supertest";
import createConnection from "../../../../database/index";
import { app } from "../../../../app";
import { Connection } from "typeorm";

let connection: Connection;

describe("Create Statement", () => {
  beforeAll(async () => {
    connection = await createConnection();

    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("/statements/balance - GET", async () => {
    await request(app)
      .post("/api/v1/users")
      .send({ name: "carlos", email: "severo@email.com", password: "1234" });

    const user = await request(app)
      .post("/api/v1/sessions")
      .send({ email: "severo@email.com", password: "1234" });

    const { token } = user.body;

    await request(app)
      .post("/api/v1/statements/deposit")
      .send({ amount: 100, description: "First deposit" })
      .set({ Authorization: `Bearer ${token}` });

    const result = await request(app)
      .get("/api/v1/statements/balance")
      .set({ Authorization: `Bearer ${token}` });

    expect(result.status).toBe(200);
    expect(result.body.statement[0]).toHaveProperty("id");
  });
});
