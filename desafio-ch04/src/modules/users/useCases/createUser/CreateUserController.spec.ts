import request from "supertest";
import createConnection from "../../../../database/index";
import { app } from "../../../../app";
import { Connection } from "typeorm";

let connection: Connection;

describe("Create User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();

    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("/users - POST", async () => {
    const result = await request(app)
      .post("/api/v1/users")
      .send({ name: "carlos", email: "severo@email.com", password: "1234" });

    console.log(result.body);
  });
});
