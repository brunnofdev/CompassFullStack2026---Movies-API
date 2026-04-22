import { DirectorRepository } from "../repositories/director-repository";
import { HttpError } from "../errors/http-error";
import { Director } from "../models/Director";

export class DirectorService {
  constructor(private readonly directorRepository: DirectorRepository) {}

  async create(name: string): Promise<Director> {
    const existingDirector = await this.directorRepository.findByName(name);
    if (existingDirector) {
      throw new HttpError("Director already exists with this name", 409);
    }

    return await this.directorRepository.create({ name });
  }

  async findAll(): Promise<Director[]> {
    return await this.directorRepository.findAll();
  }

  async findById(id: number): Promise<Director> {
    const director = await this.directorRepository.findById(id);
    if (!director) {
      throw new HttpError("Director not found", 404);
    }
    return director;
  }

  async findByIdWithMovies(id: number): Promise<Director> {
    const director = await this.directorRepository.findByIdWithMovies(id);
    if (!director) {
      throw new HttpError("Director not found", 404);
    }
    return director;
  }

  async update(id: number, name: string): Promise<void> {
    const director = await this.directorRepository.findById(id);
    if (!director) {
      throw new HttpError("Director not found", 404);
    }

    const existingName = await this.directorRepository.findByName(name);
    if (existingName && existingName.id !== id) {
      throw new HttpError("Director already exists with this name", 409);
    }

    await this.directorRepository.update(id, name);
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
