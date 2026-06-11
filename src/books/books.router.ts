import express, { type Request } from "express";
import createHttpError from "http-errors";
import multer, { type FileFilterCallback } from "multer";
import path from "node:path";
import { createBook } from "./books.controller.ts";

const bookRouter = express.Router();
const __dirname = import.meta.dirname;

function bookUploadFilter(_req: Request, file: Express.Multer.File, cb: FileFilterCallback) {
  // Validate the Image Field
  if (file.fieldname === "coverImage") {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true); // Accept the file
    } else {
      cb(
        createHttpError(400, "Validation Error: The imageFile must be an image (JPG, PNG, etc.)."),
      ); // Reject
    }
  }

  // Validate the PDF Field
  else if (file.fieldname === "file") {
    if (file.mimetype === "application/pdf") {
      cb(null, true); // Accept the file
    } else {
      cb(createHttpError(400, "Validation Error: The pdfFile must be a valid PDF document.")); // Reject
    }
  }

  // Reject any fields you aren't expecting
  else {
    cb(createHttpError(400, `Validation Error: Unexpected field name "${file.fieldname}"`));
  }
}

const upload = multer({
  dest: path.join(__dirname, "../../public/data/uploads"),
  limits: {
    fieldSize: 10 * 1024 * 1024, // 10 MB
  },
  fileFilter: bookUploadFilter,
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
