import { Request, Response, NextFunction } from "express";
import { DirectorService } from "../services/director-service";
import {
  IDirector,
  IDirectorWithMovies,
  ICreateDirectorDTO,
} from "../interfaces/director-interface";

export class DirectorController {
  constructor(private readonly directorService: DirectorService) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body as ICreateDirectorDTO;
      const director = await this.directorService.create(data);
      return res.status(201).json(director);
    } catch (error) {
      next(error);
    }
  };

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const directors = await this.directorService.findAll();
      return res.status(200).json(directors);
    } catch (error) {
      next(error);
    }
  };

  findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const director = await this.directorService.findById(Number(id));
      return res.status(200).json(director);
    } catch (error) {
      next(error);
    }
  };

  findMoviesByDirector = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.params;
      const director = await this.directorService.findById(Number(id));
      return res.status(200).json(director.movies || []);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data = req.body as ICreateDirectorDTO;
      await this.directorService.update(Number(id), data);
      return res.status(200).json({ message: "Director updated successfully" });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await this.directorService.delete(Number(id));
      return res.status(200).json({ message: "Director deleted successfully" });
    } catch (error) {
      next(error);
    }
  };
}
