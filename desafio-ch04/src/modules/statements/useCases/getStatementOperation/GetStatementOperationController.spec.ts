import request from "supertest";
import createConnection from "../../../../database/index";
import { app } from "../../../../app";
import { Connection } from "typeorm";

let connection: Connection;

describe("Get Operation", () => {
  beforeAll(async () => {
    connection = await createConnection();

    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("/statements/:id - GET", async () => {
    await request(app)
      .post("/api/v1/users")
      .send({ name: "carlos", email: "severo@email.com", password: "1234" });

    const user = await request(app)
      .post("/api/v1/sessions")
      .send({ email: "severo@email.com", password: "1234" });

    const { token } = user.body;

    const statement = await request(app)
      .post("/api/v1/statements/deposit")
      .send({ amount: 100, description: "First deposit" })
      .set({ Authorization: `Bearer ${token}` });

    const { id: idStatement } = statement.body;

    const result = await request(app)
      .get(`/api/v1/statements/${idStatement!}`)
      .set({ Authorization: `Bearer ${token}` });

    expect(result.status).toBe(200);
    expect(result.body).toHaveProperty("id");
  });
});
