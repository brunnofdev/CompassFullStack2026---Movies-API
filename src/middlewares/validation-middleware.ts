import { Request, Response, NextFunction } from "express";
import { HttpError } from "../errors/http-error";

export function validateDirector(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { name } = req.body;

  if (!name || typeof name !== "string") {
    return next(new HttpError("Name is required and must be a string", 400));
  }

  const trimmedName = name.trim();

  if (trimmedName.length < 3 || trimmedName.length > 50) {
    return next(new HttpError("Name must be between 3 and 50 characters", 400));
  }

  req.body.name = trimmedName;

  next();
}

export function validateMovie(req: Request, res: Response, next: NextFunction) {
  const { title, description, releaseYear, genre, directorId } = req.body;

  if (!title || typeof title !== "string" || title.trim() === "") {
    return next(
      new HttpError("Title is required and must be a valid string", 400),
    );
  }

  if (!genre || typeof genre !== "string" || genre.trim() === "") {
    return next(
      new HttpError("Genre is required and must be a valid string", 400),
    );
  }

  if (!directorId || typeof directorId !== "number") {
    return next(
      new HttpError("Director ID is required and must be a number", 400),
    );
  }

  if (!releaseYear || typeof releaseYear !== "number") {
    return next(
      new HttpError("Release year is required and must be a number", 400),
    );
  }

  const currentYear = new Date().getFullYear();
  if (releaseYear > currentYear) {
    return next(
      new HttpError(
        `Release year cannot be greater than the current year (${currentYear})`,
        400,
      ),
    );
  }

  // 4. Validação da Descrição (Opcional, mas com limite de 255 chars)
  if (description !== undefined) {
    if (typeof description !== "string") {
      return next(new HttpError("Description must be a string", 400));
    }
    if (description.length > 255) {
      return next(
        new HttpError(
          "Description must contain a maximum of 255 characters",
          400,
        ),
      );
    }
    req.body.description = description.trim();
  }

  req.body.title = title.trim();
  req.body.genre = genre.trim();

  next();
}
