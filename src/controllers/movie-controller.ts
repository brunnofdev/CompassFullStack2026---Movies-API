import { Request, Response, NextFunction } from "express";
import { MovieService } from "../services/movie-service";
import { ICreateMovieDTO, IMovieFilters } from "../interfaces/movie-interface";

export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body as ICreateMovieDTO;
      const movie = await this.movieService.create(data);
      return res.status(201).json(movie);
    } catch (error) {
      next(error);
    }
  };

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filters: IMovieFilters = {};
      if (req.query.title) {
        filters.title = req.query.title as string;
      }
      if (req.query.genre) {
        filters.genre = req.query.genre as string;
      }
      if (req.query.releaseYear) {
        filters.releaseYear = Number(req.query.releaseYear);
      }

      const movies = await this.movieService.findAll(filters);
      return res.status(200).json(movies);
    } catch (error) {
      next(error);
    }
  };

  findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const movie = await this.movieService.findById(Number(id));
      return res.status(200).json(movie);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data = req.body as ICreateMovieDTO;

      await this.movieService.update(Number(id), data);

      return res.status(200).json({ message: "Movie updated successfully" });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await this.movieService.delete(Number(id));

      return res.status(200).json({ message: "Movie deleted successfully" });
    } catch (error) {
      next(error);
    }
  };
}
