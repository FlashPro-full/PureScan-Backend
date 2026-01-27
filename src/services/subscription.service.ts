import { AppDataSource } from "../data-source";
import { Subscription } from "../entities/subscription.entity";

const subscriptionRepo = AppDataSource.getRepository(Subscription);

export const findSubscriptionByUserId = async (userId: number) => {
  let result = null;

  result = await subscriptionRepo.findOne({
    where: { user: { id: userId } },
  });

  return result;
};
