import "reflect-metadata";
import "dotenv/config";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5433,
  username: process.env.DB_USER || "admin",
  password: process.env.DB_PASSWORD || "adminpassword",
  database: process.env.DB_NAME || "movie_db",
  synchronize: false,
  logging: process.env.NODE_ENV !== "production",
  entities: [`${__dirname}/../models/*.{ts,js}`],
  migrations: [`${__dirname}/migrations/*.{ts,js}`],

  subscribers: [],
});
