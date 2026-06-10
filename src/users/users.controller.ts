import { type NextFunction, type Request, type Response } from "express";
import createHttpError from "http-errors";
import { UserModel } from "./users.model";

async function createUser(req: Request, res: Response, next: NextFunction) {
  const { name, email, password }: { name: string; email: string; password: string } = req.body;
  // validation
  if (!name || !email || !password) {
    const error = createHttpError(400, "All fields are required");
    return next(error);
  }
  //  database logic
  const user = await UserModel.findOne({ email });
  if (user) {
    // user is already registered in our application
    const error = createHttpError(400, "User already exists with this email");
    return next(error);
  }
  // logic

  // sending response

  res.json({
    message: "user created",
  });
}

export { createUser };
