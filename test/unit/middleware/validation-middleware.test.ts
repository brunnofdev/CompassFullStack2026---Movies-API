import {
  validateDirector,
  validateMovie,
} from "../../../src/middlewares/validation-middleware";
import { HttpError } from "../../../src/errors/http-error";
import { jest, expect, test, describe, beforeEach } from "@jest/globals";
import { Request, Response, NextFunction } from "express";

describe("Validation Middleware - validateDirector()", () => {
  test("Should call next with HttpError 400 if name is too short", () => {
    const req = { body: { name: "Ab" } } as unknown as Request;
    const res = {} as unknown as Response;
    const next = jest.fn();

    validateDirector(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(HttpError));

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 400 }),
    );
  });
});

describe("Validation Middleware - validateMovie", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {};
    jest.clearAllMocks();
  });

  test("Should call next() if all data is valid", () => {
    mockRequest.body = {
      title: "Inception",
      releaseYear: 2010,
      genre: "Sci-Fi",
      directorId: 1,
      description: "A thief who steals corporate secrets...",
    };

    validateMovie(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    );

    expect(nextFunction).toHaveBeenCalledWith();
    expect(nextFunction).not.toHaveBeenCalledWith(expect.any(HttpError));
  });

  test("Should throw HttpError 400 if title is missing", () => {
    mockRequest.body = { releaseYear: 2010, genre: "Sci-Fi", directorId: 1 };

    validateMovie(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    );

    expect(nextFunction).toHaveBeenCalledWith(expect.any(HttpError));
    const error = (nextFunction as jest.Mock).mock.calls[0][0] as HttpError;
    expect(error.statusCode).toBe(400);
    expect(error.message).toContain("Title is required");
  });

  test("Should throw HttpError 400 if releaseYear is in the future", () => {
    const futureYear = new Date().getFullYear() + 1;
    mockRequest.body = {
      title: "Future Film",
      releaseYear: futureYear,
      genre: "Sci-Fi",
      directorId: 1,
    };

    validateMovie(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    );

    expect(nextFunction).toHaveBeenCalledWith(expect.any(HttpError));
    const error = (nextFunction as jest.Mock).mock.calls[0][0] as HttpError;
    expect(error.statusCode).toBe(400);
    expect(error.message).toContain("cannot be greater than the current year");
  });

  test("Should throw HttpError 400 if description exceeds 255 characters", () => {
    mockRequest.body = {
      title: "Long Desc",
      releaseYear: 2020,
      genre: "Drama",
      directorId: 1,
      description: "a".repeat(256),
    };

    validateMovie(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    );

    expect(nextFunction).toHaveBeenCalledWith(expect.any(HttpError));
    const error = (nextFunction as jest.Mock).mock.calls[0][0] as HttpError;
    expect(error.statusCode).toBe(400);
    expect(error.message).toBe(
      "Description must contain a maximum of 255 characters",
    );
  });

  test("Should trim title and genre strings", () => {
    mockRequest.body = {
      title: "  Interstellar  ",
      releaseYear: 2014,
      genre: "  Adventure  ",
      directorId: 1,
    };

    validateMovie(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    );

    expect(mockRequest.body.title).toBe("Interstellar");
    expect(mockRequest.body.genre).toBe("Adventure");
    expect(nextFunction).toHaveBeenCalled();
  });
});
