import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let userRepositoryInMemory: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;
describe("Show profile User", () => {
  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(userRepositoryInMemory);
  });

  it("should be able to show an user profile", async () => {
    const user = await userRepositoryInMemory.create({
      email: "severo@email.com",
      name: "Severo",
      password: "1234",
    });

    const result = await showUserProfileUseCase.execute(user.id!);

    expect(result).toHaveProperty("id");
  });

  it("should not be able to show an user profile if id is wrong", async () => {
    expect(async () => {
      await userRepositoryInMemory.create({
        email: "severo@email.com",
        name: "Severo",
        password: "1234",
      });

      await showUserProfileUseCase.execute("teste");
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
