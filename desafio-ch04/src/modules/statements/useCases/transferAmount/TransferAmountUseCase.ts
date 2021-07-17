import { inject, injectable } from "tsyringe";
import { AppError } from "../../../../shared/errors/AppError";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { Statement } from "../../entities/Statement";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";

@injectable()
class TransferAmountUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({
    user_id: to_user_id,
    sender_id,
    amount,
    description,
    type,
  }: ICreateStatementDTO): Promise<Statement> {
    const { balance } = await this.statementsRepository.getUserBalance({
      user_id: sender_id!,
    });

    if (balance < amount) {
      throw new AppError("Insufficient Found");
    }

    const to_user = await this.usersRepository.findById(to_user_id);

    if (!to_user) {
      throw new AppError("User not found");
    }

    await this.statementsRepository.create({
      amount,
      type,
      description,
      user_id: sender_id!,
    });

    const statement = await this.statementsRepository.create({
      amount,
      type,
      description,
      sender_id,
      user_id: to_user?.id!,
    });

    return statement;
  }
}

export { TransferAmountUseCase };
