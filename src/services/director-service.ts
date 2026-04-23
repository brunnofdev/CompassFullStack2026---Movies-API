import { DirectorRepository } from "../repositories/director-repository";
import { HttpError } from "../errors/http-error";
import { Director } from "../models/Director";
import {
  IDirector,
  IDirectorWithMovies,
  ICreateDirectorDTO,
} from "../interfaces/director-interface";

export class DirectorService {
  constructor(private readonly directorRepository: DirectorRepository) {}

  async create(data: ICreateDirectorDTO): Promise<IDirector> {
    const existingDirector = await this.directorRepository.findByName(
      data.name,
    );
    if (existingDirector) {
      throw new HttpError("Director already exists with this name", 409);
    }

    return await this.directorRepository.create({ name: data.name });
  }

  async findAll(): Promise<IDirector[]> {
    return await this.directorRepository.findAll();
  }

  async findById(id: number): Promise<IDirector> {
    const director = await this.directorRepository.findById(id);
    if (!director) {
      throw new HttpError("Director not found", 404);
    }
    return director as IDirector;
  }

  async findMoviesByDirector(id: number): Promise<IDirectorWithMovies> {
    const director = await this.directorRepository.findByIdWithMovies(id);
    if (!director) {
      throw new HttpError("Director not found", 404);
    }
    return director as IDirectorWithMovies;
  }

  async update(id: number, data: ICreateDirectorDTO): Promise<void> {
    const director = await this.directorRepository.findById(id);
    if (!director) {
      throw new HttpError("Director not found", 404);
    }

    const existingName = await this.directorRepository.findByName(data.name);
    if (existingName && existingName.id !== id) {
      throw new HttpError("Director already exists with this name", 409);
    }

    await this.directorRepository.update(id, data.name);
  }

  async delete(id: number): Promise<void> {
    const director = await this.directorRepository.findByIdWithMovies(id);

    if (!director) {
      throw new HttpError("Director not found", 404);
    }

    if (director.movies && director.movies.length > 0) {
      throw new HttpError("Cannot delete a director with linked movies", 409);
    }

    await this.directorRepository.delete(id);
  }
}
