import { MovieRepository } from "../repositories/movie-repository";
import { DirectorRepository } from "../repositories/director-repository";
import { HttpError } from "../errors/http-error";
import {
  ICreateMovieDTO,
  IMovieFilters,
  IMovieWithDirector,
} from "../interfaces/movie-interface";

export class MovieService {
  constructor(
    private readonly movieRepository: MovieRepository,
    private readonly directorRepository: DirectorRepository,
  ) {}

  async create(data: ICreateMovieDTO): Promise<IMovieWithDirector> {
    const directorExists = await this.directorRepository.findById(
      data.directorId,
    );
    if (!directorExists) {
      throw new HttpError("Director not found. Cannot create movie.", 404);
    }

    const isDuplicate = await this.movieRepository.findExactMatch(
      data.title,
      data.releaseYear,
      data.directorId,
    );

    if (isDuplicate) {
      throw new HttpError(
        "A movie with this exact title, year, and director already exists.",
        409,
      );
    }

    const createdMovie = await this.movieRepository.create(data);
    return await this.findById(createdMovie.id);
  }

  async findAll(filters: IMovieFilters): Promise<IMovieWithDirector[]> {
    const movies = await this.movieRepository.findAll(filters);
    return movies as unknown as IMovieWithDirector[];
  }

  async findById(id: number): Promise<IMovieWithDirector> {
    const movie = await this.movieRepository.findById(id);
    if (!movie) {
      throw new HttpError("Movie not found", 404);
    }
    return movie as unknown as IMovieWithDirector;
  }

  async update(id: number, data: ICreateMovieDTO): Promise<void> {
    const movie = await this.movieRepository.findById(id);
    if (!movie) {
      throw new HttpError("Movie not found", 404);
    }

    const directorExists = await this.directorRepository.findById(
      data.directorId,
    );
    if (!directorExists) {
      throw new HttpError("Director not found. Cannot update movie.", 404);
    }

    const isDuplicate = await this.movieRepository.findExactMatch(
      data.title,
      data.releaseYear,
      data.directorId,
    );

    if (isDuplicate && isDuplicate.id !== id) {
      throw new HttpError(
        "Another movie with this exact title, year, and director already exists.",
        409,
      );
    }

    await this.movieRepository.update(id, data);
  }

  async delete(id: number): Promise<void> {
    const movie = await this.movieRepository.findById(id);
    if (!movie) {
      throw new HttpError("Movie not found", 404);
    }

    await this.movieRepository.delete(id);
  }
}
