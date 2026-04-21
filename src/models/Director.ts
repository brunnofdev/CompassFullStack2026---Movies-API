import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Movie } from "./Movie";

@Entity("tb_directors")
export class Director {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true, length: 50 })
  name!: string;

  @OneToMany(() => Movie, (movie) => movie.director)
  movies!: Movie[];
}
