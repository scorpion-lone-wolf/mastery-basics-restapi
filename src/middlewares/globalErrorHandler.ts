import { type NextFunction, type Request, type Response } from "express";
import { HttpError } from "http-errors";
import { config } from "../config/config.ts";

export default function globalErrorHandler(
  error: HttpError,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  const statusCode: number = error.statusCode || 500;

  return res.status(statusCode).json({
    message: error.message,
    // for development , sending error stack is ok, but in production it is not recommended to send error.stack.
    // Because it may log all the internal structure of your application and may lead to security issue in future.
    errorStack: config.env === "development" ? error.stack : "",
  });
}
