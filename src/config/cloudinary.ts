import { v2 as cloudinary } from "cloudinary";
import { config } from "./config.ts";
// Configuration
cloudinary.config({
  cloud_name: config.cloudinaryCloud || "",
  api_key: config.cloudinaryApiKey || "",
  api_secret: config.cloudinaryApiSecret || "",
});

export { cloudinary };
