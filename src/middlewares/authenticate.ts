import { type NextFunction, type Request, type Response } from "express";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import { config } from "../config/config.ts";

export default function validateAuth(req: Request, res: Response, next: NextFunction) {
  try {
    // get the Authorization token
    const { authorization } = req.headers;
    if (!authorization) {
      return next(createHttpError(401, "You are not authenticated"));
    }
    // split and get the token
    const token = authorization?.split(" ").at(1);
    if (!token) {
      return next(createHttpError(401, "invalid token"));
    }
    // valdiate this JWT token
    const decoded = jwt.verify(token, config.jwtSecret as string);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      next(createHttpError(500, error.message));
    }
  }
}
