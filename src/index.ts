import "dotenv/config";
import express from "express";
import { AppDataSource } from "./database/data-source";
import { errorMiddleware } from "./middlewares/error-middleware";
import directorRouter from "./Routes/director-routes";
import { movieRouter } from "./Routes/movie-routes";

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

app.use((req, res, next) => {
  console.info(
    `\n[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`,
  );
  if (req.body && Object.keys(req.body).length > 0) {
    console.info(`Body: ${JSON.stringify(req.body)}`);
  }
  next();
});

app.use("/directors", directorRouter);
app.use("/movies", movieRouter);

app.use(errorMiddleware);

AppDataSource.initialize()
  .then(() => {
    console.info("Database connected successfully!");
    app.listen(port, () => {
      console.info(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((error) => console.error("Database connection failed:", error));
