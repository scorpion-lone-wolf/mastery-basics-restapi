import { type NextFunction, type Request, type Response } from "express";

async function createBook(req: Request, res: Response, next: NextFunction) {
  return res.status(201).json({});
}

export { createBook };
