import { AppDataSource } from "../data-source";
import { Subscription } from "../entities/subscription.entity";

const subscriptionRepo = AppDataSource.getRepository(Subscription);

export const createSubscription = async (userId: number) => {
  let result = null;

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 15);
  result = await subscriptionRepo.save({
    user: { id: userId },
    plan: "trial",
    status: "trialing",
    expiresAt,
  });

  return result;
};

export const findSubscriptionByUserId = async (userId: number) => {
  let result = null;

  result = await subscriptionRepo.findOne({
    where: { user: { id: userId } },
  });

  return result;
};

export const updateSubscription = async (subscription: Partial<Subscription>) => {
  let result = null;

  result = await subscriptionRepo.update({ id: subscription.id }, subscription);

  return result;
};

export const deleteSubscription = async (id: number) => {
  let result = null;

  result = await subscriptionRepo.delete({ id: id });

  return result;
};
