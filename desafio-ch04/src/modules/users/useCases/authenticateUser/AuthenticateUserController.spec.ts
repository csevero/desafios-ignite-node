import request from "supertest";
import createConnection from "../../../../database/index";
import { app } from "../../../../app";
import { Connection } from "typeorm";

let connection: Connection;

describe("Authenticate User", () => {
  beforeAll(async () => {
    connection = await createConnection();

    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("/sessions - POST", async () => {
    await request(app)
      .post("/api/v1/users")
      .send({ name: "carlos", email: "severo@email.com", password: "1234" });

    const result = await request(app)
      .post("/api/v1/sessions")
      .send({ email: "severo@email.com", password: "1234" });

    expect(result.status).toBe(200);
    expect(result.body).toHaveProperty("token");
  });
});
