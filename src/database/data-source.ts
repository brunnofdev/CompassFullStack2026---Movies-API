import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5433,
  username: "admin",
  password: "adminpassword",
  database: "movie_db",
  synchronize: false,
  logging: false,
  entities: [`${__dirname}/../models/*.{ts,js}`],
  migrations: [`${__dirname}/migrations/*.{ts,js}`],
  subscribers: [],
});
