import { DirectorService } from "../../../src/services/director-service";
import { HttpError } from "../../../src/errors/http-error";
import {
  describe,
  jest,
  test,
  expect,
  beforeAll,
  beforeEach,
} from "@jest/globals";

describe("DirectorService", () => {
  let directorService: DirectorService;
  let directorRepositoryMock: any;

  beforeAll(() => {
    directorRepositoryMock = {
      findByName: jest.fn(),
      findById: jest.fn(),
      findByIdWithMovies: jest.fn(),
      create: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    directorService = new DirectorService(directorRepositoryMock);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  //Create Tests

  describe("create()", () => {
    test("Should throw HttpError 409 if director already exists", async () => {
      directorRepositoryMock.findByName.mockResolvedValue({
        id: 1,
        name: "Tarantino",
      });

      try {
        await directorService.create("Tarantino");
        throw new Error("Should throw a exception");
      } catch (error: any) {
        expect(error).toBeInstanceOf(HttpError);
        expect(error.statusCode).toBe(409);
      }
    });

    test("Should create a director successfully", async () => {
      directorRepositoryMock.findByName.mockResolvedValue(null);
      directorRepositoryMock.create.mockResolvedValue({
        id: 1,
        name: "Spielberg",
      });

      const result = await directorService.create("Spielberg");
      expect(result).toHaveProperty("id", 1);
      expect(directorRepositoryMock.create).toHaveBeenCalledWith({
        name: "Spielberg",
      });
    });
  });

  //Find Tests

  describe("findAll()", () => {
    test("Should return a list of directors", async () => {
      const mockList = [
        { id: 1, name: "Steven Spielberg" },
        { id: 2, name: "Christopher Nolan" },
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
      } catch (error: any) {
        expect(error).toBeInstanceOf(HttpError);
        expect(error.statusCode).toBe(404);
      }
    });

    test("Should successfully return the director", async () => {
      const mockDirector = { id: 1, name: "Quentin Tarantino" };
      directorRepositoryMock.findById.mockResolvedValue(mockDirector);

      const result = await directorService.findById(1);

      expect(result).toEqual(mockDirector);
      expect(directorRepositoryMock.findById).toHaveBeenCalledWith(1);
    });
  });

  //Update tests

  describe("update()", () => {
    test("Should throw HttpError 404 when trying to update a non-existent director", async () => {
      directorRepositoryMock.findById.mockResolvedValue(null);

      try {
        await directorService.update(999, "James Cameron");
        throw new Error("Should have thrown an exception");
      } catch (error: any) {
        expect(error).toBeInstanceOf(HttpError);
        expect(error.statusCode).toBe(404);
      }
    });

    test("Should successfully update the director's name", async () => {
      directorRepositoryMock.findById.mockResolvedValue({
        id: 1,
        name: "Old Name",
      });
      directorRepositoryMock.findByName.mockResolvedValue(null);

      await directorService.update(1, "New Name");

      expect(directorRepositoryMock.update).toHaveBeenCalledWith(1, "New Name");
    });

    describe("findByIdWithMovies()", () => {
      test("Should throw HttpError 404 when director is not found", async () => {
        directorRepositoryMock.findByIdWithMovies.mockResolvedValue(null);

        try {
          await directorService.findByIdWithMovies(999);
          throw new Error("Should have thrown an exception");
        } catch (error: any) {
          expect(error).toBeInstanceOf(HttpError);
          expect(error.statusCode).toBe(404);
        }
      });

      test("Should successfully return the director with their movies", async () => {
        // Simulamos o retorno do banco com a relação de filmes preenchida
        const mockDirectorWithMovies = {
          id: 1,
          name: "Quentin Tarantino",
          movies: [
            { id: 10, title: "Pulp Fiction" },
            { id: 11, title: "Kill Bill" },
          ],
        };

        directorRepositoryMock.findByIdWithMovies.mockResolvedValue(
          mockDirectorWithMovies,
        );

        const result = await directorService.findByIdWithMovies(1);

        expect(result).toEqual(mockDirectorWithMovies);
        expect(result).toHaveProperty("movies");
        expect(directorRepositoryMock.findByIdWithMovies).toHaveBeenCalledWith(
          1,
        );
      });
    });
  });

  //Delete tests

  describe("delete()", () => {
    test("Should throw HttpError 404 when trying to delete a non-existent director", async () => {
      directorRepositoryMock.findByIdWithMovies.mockResolvedValue(null);

      try {
        await directorService.delete(999);
        throw new Error("Should have thrown an exception");
      } catch (error: any) {
        expect(error).toBeInstanceOf(HttpError);
        expect(error.statusCode).toBe(404);
      }
    });

    test("Should throw HttpError 409 when director has linked movies", async () => {
      directorRepositoryMock.findByIdWithMovies.mockResolvedValue({
        id: 1,
        name: "Nolan",
        movies: [{ id: 10, title: "Inception" }],
      });

      try {
        await directorService.delete(1);
        throw new Error("Should have thrown an exception");
      } catch (error: any) {
        expect(error).toBeInstanceOf(HttpError);
        expect(error.statusCode).toBe(409);
        expect(error.message).toBe(
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
