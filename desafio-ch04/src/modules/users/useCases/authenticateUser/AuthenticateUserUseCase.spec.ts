import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let authenticateUserUseCase: AuthenticateUserUseCase;
let userRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate user", () => {
  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      userRepositoryInMemory
    );
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
  });

  it("should be able to authenticate an user", async () => {
    const user = {
      name: "Carlos",
      email: "severo@email.com",
      password: "1234",
    };

    await createUserUseCase.execute(user);

    const response = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(response).toHaveProperty("token");
  });

  // it("should not be able to authenticate an user with email wrong", async () => {
  //   const user = await userRepositoryInMemory.create({
  //     name: "Carlos",
  //     email: "severo@email.com",
  //     password: "1234",
  //   });

  //   const response = await authenticateUserUseCase.execute({
  //     email: user.email,
  //     password: "1234",
  //   });

  //   expect(response).toHaveProperty("token");
  // });
});
