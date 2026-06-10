import bcrypt from "bcrypt";
import { type NextFunction, type Request, type Response } from "express";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import { config } from "../config/config.ts";
import { UserModel } from "./users.model.ts";

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
  //   hashing password
  const hashedPassword = await bcrypt.hash(password, 10);
  // store the name, email and hashedPassword to the database
  const newUser = await UserModel.create({
    name,
    email,
    password: hashedPassword,
  });
  // Token generation JWT

  const accessToken = jwt.sign(
    {
      sub: newUser._id,
    },
    config.jwtSecret as string,
    {
      expiresIn: "7d",
    },
  );
  // sending response
  res.status(201).json({
    id: newUser._id,
    access_token: accessToken,
    message: "user created",
  });
}

export { createUser };
