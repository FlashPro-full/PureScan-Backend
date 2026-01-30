import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();

import { DataSource } from "typeorm";
import { User } from "./entities/user.entity";
import { Scan } from "./entities/scan.entity";
import { Product } from "./entities/product.entity";
import { ProductPricing } from "./entities/pricing.entity";
import { Subscription } from "./entities/subscription.entity";
import { TriggerGroup } from "./entities/group.entity";
import { TriggerRule } from "./entities/rule.entity";
import { Team } from "./entities/team.entity";
import { Amazon } from "./entities/amazon.entity";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  synchronize: process.env.NODE_ENV !== "production",
  logging: process.env.NODE_ENV === "development",
  entities: [
    User,
    Scan,
    Product,
    ProductPricing,
    Subscription,
    TriggerGroup,
    TriggerRule,
    Team,
    Amazon,
  ],
  migrations: ["src/migrations/**/*.ts"],
});
