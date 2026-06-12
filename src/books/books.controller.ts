import { type NextFunction, type Request, type Response } from "express";
import createHttpError from "http-errors";
import fs from "node:fs/promises";
import { uploadMediaToCloudinary } from "./book.helper.ts";
import { type Book } from "./book.types.ts";
import { BookModel } from "./books.model.ts";

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
    const { response: coverUploadResult, fileURLPath: coverURLPath } =
      await uploadMediaToCloudinary(coverImage, "image", "book-cover");

    // 2. Upload book file (raw) -> pdf
    const { response: fileUploadResult, fileURLPath } = await uploadMediaToCloudinary(
      file,
      "raw",
      "book",
    );

    // get the userid
    const userId = req.user?.sub as string;
    // 3. Create database record
    const newBook = await BookModel.create({
      title,
      genre,
      author: { _id: userId },
      coverImage: coverUploadResult.secure_url,
      file: fileUploadResult.secure_url,
    });
    // 4. Delete temp files , if fail log the error
    await Promise.all([
      fs.unlink(coverURLPath).catch((err) => {
        console.log("failed to unlink cover image", err);
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

async function updateBook(req: Request, res: Response, next: NextFunction) {
  try {
    //   get the book id that need to be patch
    const bookId = req.params.id;
    if (!bookId || Array.isArray(bookId)) {
      return next(createHttpError(400, "Book id is required"));
    }

    try {
      const book = await BookModel.findOne({
        _id: bookId,
      });
      if (!book) {
        return next(createHttpError(404, "Book not found!"));
      }
      const userId = req.user?.sub;
      if (!userId) {
        return next(createHttpError(403, "You are not authorized to update this book"));
      }
      // check if the author who created is the book and trying to update are same
      if (book.author.toString() !== userId) {
        return next(createHttpError(403, "You are not authorized to update this book"));
      }
    } catch {
      return next(createHttpError(400, "Invalid id"));
    }

    const { title, genre } = req.body ?? {};

    const files = req.files as BookFiles | undefined;

    const coverImage = files?.coverImage?.[0];
    const file = files?.file?.[0];
    //   only update the fields that are passed by the user
    const updatedBookObj: Partial<Book> = {};
    if (title) updatedBookObj.title = title;
    if (genre) updatedBookObj.genre = genre;

    if (coverImage) {
      const { response: coverUploadResult, fileURLPath: coverURLPath } =
        await uploadMediaToCloudinary(coverImage, "image", "book-cover");
      await fs.unlink(coverURLPath).catch((err) => {
        console.log("failed to unlink cover image", err);
      });
      updatedBookObj.coverImage = coverUploadResult.secure_url;
    }
    if (file) {
      const { response: fileUploadResult, fileURLPath } = await uploadMediaToCloudinary(
        file,
        "raw",
        "book",
      );
      await fs.unlink(fileURLPath).catch((err) => {
        console.log("failed to unlink file", err);
      });
      updatedBookObj.file = fileUploadResult.secure_url;
    }

    if (Object.keys(updatedBookObj).length === 0) {
      // preventing empty update
      return next(createHttpError(400, "No update field provided"));
    }

    await BookModel.updateOne(
      {
        _id: bookId,
      },
      { ...updatedBookObj },
    );
    return res.status(200).json({
      message: "Update successfully",
    });
  } catch (error) {
    if (error instanceof Error) {
      return next(createHttpError(500, error.message));
    }
    console.error(error);
  }
}

async function fetchAllBook(req: Request, res: Response, next: NextFunction) {
  try {
    // get page and limit (if not send then default set page=1 and limit=10)
    const page = Number(req.query?.page) || 1;
    const limit = Number(req.query?.limit) || 10;

    const offset = page * limit - limit;
    const [book, count] = await Promise.all([
      BookModel.find({}).skip(offset).limit(limit),
      BookModel.countDocuments(),
    ]);

    return res.json({
      result: book,
      meta: {
        page: page,
        limit: limit,
        total: count,
      },
    });
  } catch {
    return next(createHttpError(500, "Error while getting a book"));
  }
}

async function fetchBook(req: Request, res: Response, next: NextFunction) {
  try {
    const bookId = req.params.id as string;
    // check if book id os present in db or not
    const book = await BookModel.find({ _id: bookId });
    if (!book) {
      return next(createHttpError(404, "Book not found"));
    }
    return res.json({
      result: book,
    });
  } catch {
    return next(createHttpError(500, "Unable to get book"));
  }
}

export { createBook, fetchAllBook, fetchBook, updateBook };
