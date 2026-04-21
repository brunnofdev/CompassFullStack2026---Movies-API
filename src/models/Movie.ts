import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Director } from "./Director";

@Entity("tb_movies")
export class Movie {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({ length: 255, nullable: true })
  description!: string;

  @Column()
  releaseYear!: number;

  @Column()
  genre!: string;

  @Column()
  directorId!: number;

  @ManyToOne(() => Director, (director) => director.movies, {
    onDelete: "RESTRICT",
  })
  @JoinColumn({ name: "directorId" })
  director!: Director;
}
