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
    // Mock completo do repositório
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

  //Create Test

  describe("create()", () => {
    test("Should throw HttpError 400 if name is invalid", async () => {
      try {
        await directorService.create("Ab");
        throw new Error("Should throw a exception");
      } catch (error: any) {
        expect(error).toBeInstanceOf(HttpError);
        expect(error.statusCode).toBe(400);
      }
    });

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
  //Find Test

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
});
