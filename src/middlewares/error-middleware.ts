import { Request, Response, NextFunction } from "express";
import { HttpError } from "../errors/http-error";

export function errorMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (error instanceof HttpError) {
    console.warn(`[HttpError] ${error.message} - Status: ${error.statusCode}`);
    return res.status(error.statusCode).json({ error: error.message });
  }

  console.error(`[Unhandled Error] ${error.message}`);
  return res.status(500).json({ error: "Internal Server Error" });
}
