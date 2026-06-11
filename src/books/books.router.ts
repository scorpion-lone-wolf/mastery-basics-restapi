import express from "express";
import { createBook } from "./books.controller.ts";

const bookRouter = express.Router();

// routes
bookRouter.post("/", createBook);

export default bookRouter;
