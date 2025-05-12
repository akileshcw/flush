import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err.stack);
  const status = err.message === "Doctor not found" ? 404 : 500;
  res.status(status).json({ error: err.message || "Internal server error" });
}
