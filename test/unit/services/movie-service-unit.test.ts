import { MovieService } from "../../../src/services/movie-service";
import { MovieRepository } from "../../../src/repositories/movie-repository";
import { DirectorRepository } from "../../../src/repositories/director-repository";
import { HttpError } from "../../../src/errors/http-error";
import { describe, test, expect, beforeEach, jest } from "@jest/globals";
import { ICreateMovieDTO } from "../../../src/interfaces/movie-interface";
import { Movie } from "../../../src/models/Movie";
import { Director } from "../../../src/models/Director";

const mockMovieRepository = {
  create: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  findExactMatch: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
} as unknown as jest.Mocked<MovieRepository>;

const mockDirectorRepository = {
  findById: jest.fn(),
} as unknown as jest.Mocked<DirectorRepository>;

describe("MovieService", () => {
  let movieService: MovieService;

  beforeEach(() => {
    jest.clearAllMocks();
    movieService = new MovieService(
      mockMovieRepository,
      mockDirectorRepository,
    );
  });

  describe("create", () => {
    const validMovieDTO: ICreateMovieDTO = {
      title: "Interstellar",
      releaseYear: 2014,
      genre: "Sci-Fi",
      directorId: 1,
    };

    test("Should successfully create a movie", async () => {
      mockDirectorRepository.findById.mockResolvedValue({
        id: 1,
        name: "Nolan",
      } as unknown as Director);

      mockMovieRepository.findExactMatch.mockResolvedValue(null);

      mockMovieRepository.create.mockResolvedValue({
        ...validMovieDTO,
        id: 10,
      } as unknown as Movie);

      mockMovieRepository.findById.mockResolvedValue({
        ...validMovieDTO,
        id: 10,
        director: { id: 1, name: "Nolan" } as unknown as Director,
      } as unknown as Movie);

      const result = await movieService.create(validMovieDTO);

      expect(result.id).toBe(10);
      expect(result.director.name).toBe("Nolan");
      expect(mockMovieRepository.create).toHaveBeenCalledTimes(1);
    });

    test("Should throw HttpError 404 if director does not exist", async () => {
      mockDirectorRepository.findById.mockResolvedValue(null);

      await expect(movieService.create(validMovieDTO)).rejects.toThrow(
        HttpError,
      );
      await expect(movieService.create(validMovieDTO)).rejects.toMatchObject({
        statusCode: 404,
        message: "Director not found. Cannot create movie.",
      });

      expect(mockMovieRepository.create).not.toHaveBeenCalled();
    });

    test("Should throw HttpError 409 if exact movie already exists", async () => {
      mockDirectorRepository.findById.mockResolvedValue({
        id: 1,
        name: "Nolan",
      } as unknown as Director);

      mockMovieRepository.findExactMatch.mockResolvedValue({
        id: 99,
        ...validMovieDTO,
      } as unknown as Movie);

      await expect(movieService.create(validMovieDTO)).rejects.toThrow(
        HttpError,
      );
      await expect(movieService.create(validMovieDTO)).rejects.toMatchObject({
        statusCode: 409,
      });

      expect(mockMovieRepository.create).not.toHaveBeenCalled();
    });
  });

  describe("delete", () => {
    test("Should throw HttpError 404 if movie to delete is not found", async () => {
      mockMovieRepository.findById.mockResolvedValue(null);

      await expect(movieService.delete(999)).rejects.toThrow(HttpError);
      await expect(movieService.delete(999)).rejects.toMatchObject({
        statusCode: 404,
      });
    });

    test("Should successfully delete a movie", async () => {
      mockMovieRepository.findById.mockResolvedValue({
        id: 1,
        title: "Batman",
      } as unknown as Movie);

      mockMovieRepository.delete.mockResolvedValue(undefined);

      await movieService.delete(1);

      expect(mockMovieRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});
