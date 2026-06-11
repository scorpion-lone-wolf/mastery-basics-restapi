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
  try {
    const user = await UserModel.findOne({ email });
    if (user) {
      // user is already registered in our application
      const error = createHttpError(400, "User already exists with this email");
      return next(error);
    }
  } catch (error) {
    console.error(error);
    return next(createHttpError(500, "Error while getting user"));
  }

  //   hashing password
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
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
  } catch (error) {
    console.error(error);
    return next(createHttpError(500, "Unable to create user"));
  }
}

async function loginUser(req: Request, res: Response, next: NextFunction) {
  // get email and password from body
  const { email, password } = req.body;
  //   valdiation
  if (!email || !password) {
    const error = createHttpError(400, "Both email & password are required");
    return next(error); // this will be handled by global error handler
  }
  try {
    //   check if exist in our db or not
    const retrivedUser = await UserModel.findOne({ email });
    if (!retrivedUser) {
      const error = createHttpError(404, "User not found");
      return next(error); // this will be handled by global error handler
    }
    // validate the password after hashing with the retrivedUser hashsed password
    const isPasswordMatched = await bcrypt.compare(password, retrivedUser.password);
    if (!isPasswordMatched) {
      const error = createHttpError(401, "Please enter valid Credientals");
      return next(error); // this will be handled by global error handler
    }
    // generate the access token so that user can access protected route
    const accessToken = jwt.sign(
      {
        sub: retrivedUser._id,
      },
      config.jwtSecret as string,
      {
        expiresIn: "7d",
      },
    );
    return res.json({
      message: "login successful",
      accessToken,
    });
  } catch {
    const err = createHttpError(500, "Unable to login user");
    return next(err); // this will be handled by global error handler
  }
}

export { createUser, loginUser };
