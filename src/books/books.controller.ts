import { type NextFunction, type Request, type Response } from "express";
import createHttpError from "http-errors";
import fs from "node:fs/promises";
import path from "node:path";
import { cloudinary } from "../config/cloudinary.ts";
import { BookModel } from "./books.model.ts";

const __dirname = import.meta.dirname;

type BookFiles = {
  coverImage?: Express.Multer.File[];
  file?: Express.Multer.File[];
};
async function createBook(req: Request, res: Response, next: NextFunction) {
  const files = req.files as BookFiles | undefined;
  const { title, genre } = req.body;

  const coverImage = files?.coverImage?.[0];
  const file = files?.file?.[0];

  if (!coverImage || !file) {
    const error = createHttpError(400, "Both cover image and file is required ");
    return next(error);
  }
  try {
    // 1. Upload Cover Image
    const coverFileName = coverImage.filename;
    const coverURLPath = path.join(__dirname, "../../public/data/uploads", coverFileName);
    const coverUploadResult = await cloudinary.uploader.upload(coverURLPath, {
      resource_type: "image",
      filename_override: coverFileName,
      folder: "book-cover",
    });

    // 2. Upload book file (raw) -> pdf
    const fileName = file.filename;
    const fileURLPath = path.join(__dirname, "../../public/data/uploads", fileName);
    const fileUploadResult = await cloudinary.uploader.upload(fileURLPath, {
      resource_type: "raw", // This is needed to upload file other then image and video
      filename_override: fileName,
      folder: "book",
    });

    // 3. Create database record
    const newBook = await BookModel.create({
      title,
      genre,
      author: { _id: "6a2965160802bbad1f3c89b3" },
      coverImage: coverUploadResult.secure_url,
      file: fileUploadResult.secure_url,
    });
    // 4. Delete temp files , if fail log the error
    await Promise.all([
      fs.unlink(coverURLPath).catch((err) => {
        console.log("failed to unline cover image", err);
      }),
      fs.unlink(fileURLPath).catch((err) => {
        console.log("failed to unlink file", err);
      }),
    ]);

    return res.status(201).json({
      message: "Book created successfully",
      id: newBook._id,
    });
  } catch {
    const error = createHttpError(500, "Unable to upload files");
    return next(error);
  }
}

export { createBook };
