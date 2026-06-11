import express from "express";
import multer from "multer";
import path from "node:path";
import { createBook } from "./books.controller.ts";

const bookRouter = express.Router();
const __dirname = import.meta.dirname;

const upload = multer({
  dest: path.join(__dirname, "../../public/data/uploads"),
  limits: {
    fieldSize: 5 * 1024 * 1024, // 5 MB
  },
});

// routes
bookRouter.post(
  "/",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  createBook,
);

export default bookRouter;
