import { Router } from "express";
import { DirectorController } from "../controllers/director-controller";
import { DirectorService } from "../services/director-service";
import { DirectorRepository } from "../repositories/director-repository";
import { validateDirector } from "../middlewares/validation-middleware";

const directorRouter = Router();

const repository = new DirectorRepository();
const service = new DirectorService(repository);
const controller = new DirectorController(service);

directorRouter.get("/", controller.findAll);
directorRouter.get("/:id", controller.findById);
directorRouter.get("/:id/movies", controller.findMoviesByDirector);

directorRouter.post("/", validateDirector, controller.create);
directorRouter.put("/:id", validateDirector, controller.update);
directorRouter.delete("/:id", controller.delete);

export default directorRouter;
