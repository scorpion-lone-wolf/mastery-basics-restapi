import path from "node:path";
import { cloudinary } from "../config/cloudinary.ts";

const __dirname = import.meta.dirname;
export async function uploadMediaToCloudinary(
  file: Express.Multer.File,
  resourceType: "image" | "video" | "raw",
  folder: string,
) {
  const fileName = file.filename;
  const fileURLPath = path.join(__dirname, "../../public/data/uploads", fileName);
  const response = await cloudinary.uploader.upload(fileURLPath, {
    resource_type: resourceType,
    filename_override: fileName,
    folder,
  });
  return { response, fileURLPath };
}
