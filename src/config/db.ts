import mongoose from "mongoose";
import { config } from "./config.ts";

export default async function connectToDB() {
  try {
    // Once the database is connected
    mongoose.connection.on("connected", () => {
      console.log("Connected to database");
    });

    // after initial connection is established and then some error occur in db then this event emmitter "error" will be fired
    mongoose.connection.on("error", (error) => {
      console.log("Error in connection to mongodb", error);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("Database is disconnected...");
    });

    await mongoose.connect(config.monogoConnString || "");
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to connect to database.", error.message);
    } else {
      console.log("Failed to connect to database.", error);
    }
    process.exit(1);
  }
}
