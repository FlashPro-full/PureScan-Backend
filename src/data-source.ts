import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();

import { DataSource } from "typeorm";
import { User } from "./entities/user.entity";
import { Scan } from "./entities/scan.entity";
import { Subscription } from "./entities/subscription.entity";
import { Preference } from "./entities/preference.entity";
import { Sound } from "./entities/sound.entity";
import { Shipment } from "./entities/shipment.entity";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  synchronize: process.env.NODE_ENV !== "production",
  logging: process.env.NODE_ENV === "development",
  entities: [
    User,
    Scan,
    Subscription,
    Preference,
    Sound,
    Shipment
  ],
  migrations: ["src/migrations/**/*.ts"],
});
