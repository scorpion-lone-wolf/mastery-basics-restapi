import mongoose from "mongoose";
import { type Book } from "./book.types.ts";

const bookSchema = new mongoose.Schema<Book>(
  {
    title: {
      required: true,
      type: String,
    },
    author: {
      required: true,
      type: mongoose.Schema.Types.ObjectId, // this is the special type used for managing relationship between two collections
    },
    genre: {
      required: true,
      type: String,
    },
    coverImage: {
      required: true,
      type: String,
    },
    file: {
      required: true,
      type: String,
    },
  },
  {
    timestamps: true, // this will add createdAt and updatedAt
  },
);

export const BookModel = mongoose.model<Book>("Book", bookSchema);
