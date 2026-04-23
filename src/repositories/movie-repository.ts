import { Repository, FindOptionsWhere, ILike } from "typeorm";
import { AppDataSource } from "../database/data-source";
import { Movie } from "../models/Movie";
import { IMovieFilters } from "../interfaces/movie-interface";

export class MovieRepository {
  private repository: Repository<Movie>;

  constructor() {
    this.repository = AppDataSource.getRepository(Movie);
  }

  async create(data: Partial<Movie>): Promise<Movie> {
    const movie = this.repository.create(data);
    return await this.repository.save(movie);
  }

  async findAll(filters: IMovieFilters): Promise<Movie[]> {
    const where: FindOptionsWhere<Movie> = {};

    if (filters.title) {
      where.title = ILike(`%${filters.title}%`);
    }

    if (filters.genre) {
      where.genre = ILike(`%${filters.genre}%`);
    }

    if (filters.releaseYear) {
      where.releaseYear = filters.releaseYear;
    }

    return await this.repository.find({
      where,
      relations: ["director"],
    });
  }

  async findById(id: number): Promise<Movie | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ["director"],
    });
  }

  async findExactMatch(
    title: string,
    releaseYear: number,
    directorId: number,
  ): Promise<Movie | null> {
    return await this.repository.findOne({
      where: {
        title,
        releaseYear,
        directorId,
      },
    });
  }

  async update(id: number, data: Partial<Movie>): Promise<void> {
    await this.repository.update(id, data);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
