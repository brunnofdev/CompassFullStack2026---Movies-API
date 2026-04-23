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

  describe("create()", () => {
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

  describe("findAll()", () => {
    test("Should return a list of movies based on filters", async () => {
      const mockMovies = [
        {
          id: 1,
          title: "Inception",
          releaseYear: 2010,
          genre: "Sci-Fi",
          directorId: 1,
        },
      ] as unknown as Movie[];

      mockMovieRepository.findAll.mockResolvedValue(mockMovies);

      const filters = { genre: "Sci-Fi" };
      const result = await movieService.findAll(filters);

      expect(result).toEqual(mockMovies);
      expect(mockMovieRepository.findAll).toHaveBeenCalledWith(filters);
    });
  });

  describe("findById()", () => {
    test("Should throw HttpError 404 when movie is not found", async () => {
      mockMovieRepository.findById.mockResolvedValue(null);

      try {
        await movieService.findById(999);
        throw new Error("Should have thrown an exception");
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(HttpError);
        const httpError = error as HttpError;
        expect(httpError.statusCode).toBe(404);
      }
    });

    test("Should successfully return the movie", async () => {
      const mockMovie = { id: 1, title: "Inception" } as unknown as Movie;
      mockMovieRepository.findById.mockResolvedValue(mockMovie);

      const result = await movieService.findById(1);

      expect(result).toEqual(mockMovie);
      expect(mockMovieRepository.findById).toHaveBeenCalledWith(1);
    });
  });

  describe("update()", () => {
    const updateDTO: ICreateMovieDTO = {
      title: "Dunkirk",
      releaseYear: 2017,
      genre: "War",
      directorId: 1,
    };

    test("Should throw HttpError 404 if movie to update is not found", async () => {
      mockMovieRepository.findById.mockResolvedValue(null);

      try {
        await movieService.update(999, updateDTO);
        throw new Error("Should have thrown an exception");
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(HttpError);
        const httpError = error as HttpError;
        expect(httpError.statusCode).toBe(404);
      }
    });

    test("Should throw HttpError 404 if new director is not found", async () => {
      mockMovieRepository.findById.mockResolvedValue({
        id: 1,
      } as unknown as Movie);
      mockDirectorRepository.findById.mockResolvedValue(null);

      try {
        await movieService.update(1, updateDTO);
        throw new Error("Should have thrown an exception");
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(HttpError);
        const httpError = error as HttpError;
        expect(httpError.statusCode).toBe(404);
      }
    });

    test("Should throw HttpError 409 if updating creates an exact duplicate of another movie", async () => {
      mockMovieRepository.findById.mockResolvedValue({
        id: 1,
      } as unknown as Movie);
      mockDirectorRepository.findById.mockResolvedValue({
        id: 1,
      } as unknown as Director);
      mockMovieRepository.findExactMatch.mockResolvedValue({
        id: 2,
        ...updateDTO,
      } as unknown as Movie);

      try {
        await movieService.update(1, updateDTO);
        throw new Error("Should have thrown an exception");
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(HttpError);
        const httpError = error as HttpError;
        expect(httpError.statusCode).toBe(409);
      }
    });

    test("Should successfully update the movie", async () => {
      mockMovieRepository.findById.mockResolvedValue({
        id: 1,
      } as unknown as Movie);
      mockDirectorRepository.findById.mockResolvedValue({
        id: 1,
      } as unknown as Director);
      mockMovieRepository.findExactMatch.mockResolvedValue(null);

      await movieService.update(1, updateDTO);

      expect(mockMovieRepository.update).toHaveBeenCalledWith(1, updateDTO);
    });
  });

  describe("delete()", () => {
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
