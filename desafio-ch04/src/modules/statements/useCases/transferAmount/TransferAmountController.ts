import { Request, Response } from "express";
import { container } from "tsyringe";
import { TransferAmountUseCase } from "./TransferAmountUseCase";

enum OperationType {
  TRANSFER = "transfer",
}
class TransferAmountController {
  async execute(request: Request, response: Response): Promise<Response> {
    const { user_id: to_user_id } = request.params;
    const { amount, description } = request.body;
    const { id: me_id } = request.user;

    const spllitedPath = request.originalUrl.split("/");
    const type = spllitedPath[spllitedPath.length - 2] as OperationType;

    const transferAmountUseCase = container.resolve(TransferAmountUseCase);

    const statement = await transferAmountUseCase.execute({
      user_id: to_user_id,
      sender_id: me_id,
      amount,
      type,
      description,
    });

    return response.json(statement);
  }
}

export { TransferAmountController };
