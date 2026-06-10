import mongoose from "mongoose";
import { User } from "./user.types.ts";

const userSchema = new mongoose.Schema<User>(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      unique: true,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true, // this will add createdAt and updatedAt in the database
  },
);
// creating model with the schema (users collection will be created for User )
export const UserModel = mongoose.model<User>("User", userSchema);
