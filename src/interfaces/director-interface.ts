import { IMovie } from "./movie-interface";

export interface IDirector {
  id: number;
  name: string;
}

export interface IDirectorWithMovies extends IDirector {
  movies: IMovie[];
}

export interface ICreateDirectorDTO {
  name: string;
}
