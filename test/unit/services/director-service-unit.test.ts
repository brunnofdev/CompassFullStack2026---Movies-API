import { DirectorService } from "../../../src/services/director-service";
import { HttpError } from "../../../src/errors/http-error";
import { Director } from "../../../src/models/Director";
import {
  describe,
  jest,
  test,
  expect,
  beforeAll,
  beforeEach,
} from "@jest/globals";
import { DirectorRepository } from "../../../src/repositories/director-repository";

describe("DirectorService", () => {
  let directorService: DirectorService;

  const directorRepositoryMock = {
    findByName: jest.fn(),
    findById: jest.fn(),
    findByIdWithMovies: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  } as unknown as jest.Mocked<DirectorRepository>;

  beforeEach(() => {
    jest.clearAllMocks();
    directorService = new DirectorService(directorRepositoryMock);
  });

  // Create Tests
  describe("create()", () => {
    test("Should throw HttpError 409 if director already exists", async () => {
      directorRepositoryMock.findByName.mockResolvedValue({
        id: 1,
        name: "Tarantino",
      } as unknown as Director);

      try {
        await directorService.create({ name: "Tarantino" });
        throw new Error("Should throw a exception");
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(HttpError);
        const httpError = error as HttpError;
        expect(httpError.statusCode).toBe(409);
      }
    });

    test("Should create a director successfully", async () => {
      directorRepositoryMock.findByName.mockResolvedValue(null);
      directorRepositoryMock.create.mockResolvedValue({
        id: 1,
        name: "Spielberg",
      } as unknown as Director);

      const result = await directorService.create({ name: "Spielberg" });
      expect(result).toHaveProperty("id", 1);
      expect(directorRepositoryMock.create).toHaveBeenCalledWith({
        name: "Spielberg",
      });
    });
  });

  // Find Tests
  describe("findAll()", () => {
    test("Should return a list of directors", async () => {
      const mockList = [
        { id: 1, name: "Steven Spielberg" } as unknown as Director,
        { id: 2, name: "Christopher Nolan" } as unknown as Director,
      ];

      directorRepositoryMock.findAll.mockResolvedValue(mockList);

      const result = await directorService.findAll();

      expect(result).toEqual(mockList);
      expect(directorRepositoryMock.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe("findById()", () => {
    test("Should throw HttpError 404 when director is not found", async () => {
      directorRepositoryMock.findById.mockResolvedValue(null);

      try {
        await directorService.findById(999);
        throw new Error("Should have thrown an exception");
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(HttpError);
        const httpError = error as HttpError;
        expect(httpError.statusCode).toBe(404);
      }
    });

    test("Should successfully return the director", async () => {
      const mockDirector = {
        id: 1,
        name: "Quentin Tarantino",
      } as unknown as Director;

      directorRepositoryMock.findById.mockResolvedValue(mockDirector);

      const result = await directorService.findById(1);

      expect(result).toEqual(mockDirector);
      expect(directorRepositoryMock.findById).toHaveBeenCalledWith(1);
    });

    test("Should successfully return the director with movies", async () => {
      const mockDirector = {
        id: 1,
        name: "Quentin Tarantino",
        movies: [
          {
            id: 10,
            title: "Pulp Fiction",
            releaseYear: 1994,
            genre: "Crime",
            directorId: 1,
          },
        ],
      } as unknown as Director;

      directorRepositoryMock.findByIdWithMovies.mockResolvedValue(mockDirector);

      const result = await directorService.findMoviesByDirector(1);

      expect(result).toEqual(mockDirector);
      expect(directorRepositoryMock.findByIdWithMovies).toHaveBeenCalledWith(1);
    });
  });

  // Update tests
  describe("update()", () => {
    test("Should throw HttpError 404 when trying to update a non-existent director", async () => {
      directorRepositoryMock.findById.mockResolvedValue(null);

      try {
        await directorService.update(999, { name: "James Cameron" });
        throw new Error("Should have thrown an exception");
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(HttpError);
        const httpError = error as HttpError;
        expect(httpError.statusCode).toBe(404);
      }
    });

    test("Should successfully update the director's name", async () => {
      directorRepositoryMock.findById.mockResolvedValue({
        id: 1,
        name: "Old Name",
      } as unknown as Director);
      directorRepositoryMock.findByName.mockResolvedValue(null);

      await directorService.update(1, { name: "New Name" });

      expect(directorRepositoryMock.update).toHaveBeenCalledWith(1, "New Name");
    });
  });

  // Delete tests
  describe("delete()", () => {
    test("Should throw HttpError 404 when trying to delete a non-existent director", async () => {
      directorRepositoryMock.findByIdWithMovies.mockResolvedValue(null);

      try {
        await directorService.delete(999);
        throw new Error("Should have thrown an exception");
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(HttpError);
        const httpError = error as HttpError;
        expect(httpError.statusCode).toBe(404);
      }
    });

    test("Should throw HttpError 409 when director has linked movies", async () => {
      directorRepositoryMock.findByIdWithMovies.mockResolvedValue({
        id: 1,
        name: "Nolan",
        movies: [
          {
            id: 10,
            title: "Inception",
            releaseYear: 2010,
            genre: "Sci-Fi",
            directorId: 1,
            description: "",
          },
        ],
      } as unknown as Director);

      try {
        await directorService.delete(1);
        throw new Error("Should have thrown an exception");
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(HttpError);
        const httpError = error as HttpError;
        expect(httpError.statusCode).toBe(409);
        expect(httpError.message).toBe(
          "Cannot delete a director with linked movies",
        );
      }
    });

    test("Should successfully delete the director when there are no linked movies", async () => {
      directorRepositoryMock.findByIdWithMovies.mockResolvedValue({
        id: 1,
        name: "Nolan",
        movies: [],
      });

      await directorService.delete(1);

      expect(directorRepositoryMock.delete).toHaveBeenCalledWith(1);
    });
  });
});
