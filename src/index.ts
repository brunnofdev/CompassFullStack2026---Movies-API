import express from "express";
import { AppDataSource } from "./database/data-source";
import { errorMiddleware } from "./middlewares/error-middleware";
import directorRouter from "./Routes/director-routes";

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  console.info(`[${req.method}] ${req.url}`);
  next();
});

app.use("/directors", directorRouter);

app.use(errorMiddleware);

AppDataSource.initialize()
  .then(() => {
    console.info("Database connected successfully!");
    app.listen(3000, () => {
      console.info("Server is running on http://localhost:3000");
    });
  })
  .catch((error) => console.error("Database connection failed:", error));
