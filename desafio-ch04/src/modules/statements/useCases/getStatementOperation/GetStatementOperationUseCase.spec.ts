import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let getStatementOperationUseCase: GetStatementOperationUseCase;
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
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      usersRepositoryInMemory,
      statementRepositoryInMemory
    );
  });

  it("should be able to get a operation of an user", async () => {
    const user = await usersRepositoryInMemory.create({
      name: "Carlos",
      email: "severo@email.com",
      password: "1234",
    });

    const statementDeposit = await statementRepositoryInMemory.create({
      user_id: user.id!,
      type: "DEPOSIT" as OperationType,
      amount: 150,
      description: "Primeiro deposito!",
    });

    const statement = await getStatementOperationUseCase.execute({
      user_id: user.id!,
      statement_id: statementDeposit.id!,
    });

    expect(statement).toHaveProperty("id");
  });

  it("should not be able to get operation if not found user", async () => {
    expect(async () => {
      const user = await usersRepositoryInMemory.create({
        name: "Carlos",
        email: "severo@email.com",
        password: "1234",
      });

      const statementDeposit = await statementRepositoryInMemory.create({
        user_id: user.id!,
        type: "DEPOSIT" as OperationType,
        amount: 150,
        description: "Primeiro deposito!",
      });

      await getStatementOperationUseCase.execute({
        user_id: "1234",
        statement_id: statementDeposit.id!,
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("should not be able to get operation if not found operation", async () => {
    expect(async () => {
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

      await getStatementOperationUseCase.execute({
        user_id: user.id!,
        statement_id: "1234",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});
