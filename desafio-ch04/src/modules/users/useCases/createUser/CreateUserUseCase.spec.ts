import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let userRepositoryInMemory: InMemoryUsersRepository;

describe("Create a user", () => {
  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
  });

  it("should be able to create a new user", async () => {
    const result = await createUserUseCase.execute({
      name: "teste",
      email: "teste",
      password: "1234",
    });

    expect(result).toHaveProperty("id");
  });

  it("should not be able to create a user with exists email", () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "teste",
        email: "teste",
        password: "1234",
      });
      await createUserUseCase.execute({
        name: "teste",
        email: "teste",
        password: "1234",
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
