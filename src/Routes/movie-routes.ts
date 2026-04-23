import { Router } from "express";
import { MovieController } from "../controllers/movie-controller";
import { MovieService } from "../services/movie-service";
import { MovieRepository } from "../repositories/movie-repository";
import { DirectorRepository } from "../repositories/director-repository";
import { validateMovie } from "../middlewares/validation-middleware";

const movieRouter = Router();

const movieRepository = new MovieRepository();
const directorRepository = new DirectorRepository();
const movieService = new MovieService(movieRepository, directorRepository);
const movieController = new MovieController(movieService);

movieRouter.post("/", validateMovie, movieController.create);
movieRouter.get("/", movieController.findAll);
movieRouter.get("/:id", movieController.findById);
movieRouter.put("/:id", validateMovie, movieController.update);
movieRouter.delete("/:id", movieController.delete);

export { movieRouter };
