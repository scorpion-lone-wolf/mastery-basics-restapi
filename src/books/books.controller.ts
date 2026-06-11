import { type NextFunction, type Request, type Response } from "express";
import createHttpError from "http-errors";
import path from "node:path";
import { cloudinary } from "../config/cloudinary.ts";

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
    const coverFileName = coverImage.filename;
    const coverURLToPath = path.join(__dirname, "../../public/data/uploads", coverFileName);
    const coverUploadResult = await cloudinary.uploader.upload(coverURLToPath, {
      resource_type: "image",
      filename_override: coverFileName,
      folder: "book-cover",
    });

    const fileName = file.filename;
    const fileURLToPath = path.join(__dirname, "../../public/data/uploads", fileName);
    const fileUploadResult = await cloudinary.uploader.upload(fileURLToPath, {
      resource_type: "raw", // This is needed to upload file other then image and video
      filename_override: fileName,
      folder: "book",
    });
    // printing response
    console.log("Image Upload", coverUploadResult);
    console.log("pdf Upload", fileUploadResult);
    console.log("title", title);
    console.log("genre", genre);
    // storing the data in database
  } catch {
    const error = createHttpError(500, "Unable to upload files");
    return next(error);
  }

  return res.status(201).json({});
}

export { createBook };
