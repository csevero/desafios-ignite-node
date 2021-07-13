import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let getBalanceUseCase: GetBalanceUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
let statementRepositoryInMemory: InMemoryStatementsRepository;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("Create Statement", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementRepositoryInMemory = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      statementRepositoryInMemory,
      usersRepositoryInMemory
    );
  });

  it("should be able to get balance of an user", async () => {
    const user = await usersRepositoryInMemory.create({
      name: "Carlos",
      email: "severo@email.com",
      password: "1234",
    });

    await statementRepositoryInMemory.create({
      user_id: user.id!,
      type: "DEPOSIT" as OperationType,
      amount: 150,
      description: "Primeiro deposito!",
    });

    const statement = await getBalanceUseCase.execute({
      user_id: user.id!,
    });

    expect(statement.statement[0]).toHaveProperty("id");
    expect(statement.statement.length).toBe(1);
  });

  it("should not be able to get balance if not found user", async () => {
    expect(async () => {
      await usersRepositoryInMemory.create({
        name: "Carlos",
        email: "severo@email.com",
        password: "1234",
      });

      await getBalanceUseCase.execute({
        user_id: "1234",
      });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});
