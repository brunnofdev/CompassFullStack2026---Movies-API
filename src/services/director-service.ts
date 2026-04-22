import { DirectorRepository } from "../repositories/director-repository";
import { HttpError } from "../errors/http-error";
import { Director } from "../models/Director";

export class DirectorService {
  constructor(private readonly directorRepository: DirectorRepository) {}

  async create(name: string): Promise<Director> {
    if (!name || name.trim().length < 3 || name.trim().length > 50) {
      throw new HttpError("Name must be between 3 and 50 characters", 400);
    }

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
}
