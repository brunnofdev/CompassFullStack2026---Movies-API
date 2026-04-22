import { Repository } from "typeorm";
import { AppDataSource } from "../database/data-source";
import { Director } from "../models/Director";

export class DirectorRepository {
  private repository: Repository<Director>;

  constructor() {
    this.repository = AppDataSource.getRepository(Director);
  }

  async findByName(name: string): Promise<Director | null> {
    return await this.repository.findOne({ where: { name } });
  }

  async findById(id: number): Promise<Director | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async findByIdWithMovies(id: number): Promise<Director | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ["movies"],
    });
  }

  async create(data: Partial<Director>): Promise<Director> {
    const director = this.repository.create(data);
    return await this.repository.save(director);
  }

  async findAll(): Promise<Director[]> {
    return await this.repository.find();
  }

  async update(id: number, name: string): Promise<void> {
    await this.repository.update(id, { name });
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
