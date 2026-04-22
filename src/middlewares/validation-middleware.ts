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
