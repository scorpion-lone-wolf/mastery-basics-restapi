import { User } from "../users/user.types";

export type Book = {
  _id: string;
  title: string;
  author: User;
  genre: string;
  bookCoverImageURL: string;
  bookPdfURL: string;
};
