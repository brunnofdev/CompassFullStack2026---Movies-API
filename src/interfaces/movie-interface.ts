import { IDirector } from "./director-interface";

export interface IMovie {
  id: number;
  title: string;
  description?: string;
  releaseYear: number;
  genre: string;
  directorId: number;
}

export interface IMovieWithDirector extends IMovie {
  director: IDirector;
}

export interface ICreateMovieDTO {
  title: string;
  description?: string;
  releaseYear: number;
  genre: string;
  directorId: number;
}

export interface IMovieFilters {
  title?: string;
  genre?: string;
  releaseYear?: number;
}
