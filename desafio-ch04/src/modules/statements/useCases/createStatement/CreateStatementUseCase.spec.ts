import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let createStatementUseCase: CreateStatementUseCase;
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
    createStatementUseCase = new CreateStatementUseCase(
      usersRepositoryInMemory,
      statementRepositoryInMemory
    );
  });

  it("should be able to create a new statement", async () => {
    const user = await usersRepositoryInMemory.create({
      name: "Carlos",
      email: "severo@email.com",
      password: "1234",
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id!,
      type: "DEPOSIT" as OperationType,
      amount: 150,
      description: "Primeiro Deposito!",
    });

    expect(statement).toHaveProperty("id");
  });

  it("should not be able to withdraw a value if it does not have an equal or greater value in account", async () => {
    expect(async () => {
      const user = await usersRepositoryInMemory.create({
        name: "Carlos",
        email: "severo@email.com",
        password: "1234",
      });

      await createStatementUseCase.execute({
        user_id: user.id!,
        type: "WITHDRAW" as OperationType,
        amount: 150,
        description: "Primeiro Saque!",
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });

  it("should not be able to withdraw a value if not found user", async () => {
    expect(async () => {
      const user = await usersRepositoryInMemory.create({
        name: "Carlos",
        email: "severo@email.com",
        password: "1234",
      });

      await createStatementUseCase.execute({
        user_id: "1234",
        type: "WITHDRAW" as OperationType,
        amount: 150,
        description: "Primeiro Saque!",
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });
});
