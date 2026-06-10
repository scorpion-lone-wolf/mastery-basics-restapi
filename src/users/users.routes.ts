import express from "express";
import { createUser } from "./users.controller.ts";

const userRouter = express.Router();

// routes
userRouter.post("/register", createUser);

export default userRouter;
