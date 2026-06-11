import { type User } from "../users/user.types.ts";

export type Book = {
  _id: string;
  title: string;
  author: User;
  genre: string;
  coverImage: string;
  file: string;
};
