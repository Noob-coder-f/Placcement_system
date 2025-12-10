import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudynari.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {

    const mime = file.mimetype;

    let folder = "others";
    let resource_type = "image";

    if (mime.startsWith("image/")) {
      folder = "images";
      resource_type = "image";
    }
    else if (mime === "application/pdf") {
      folder = "study-materials";
      resource_type = "raw";
    }
    else if (mime.startsWith("video/")) {
      folder = "videos";
      resource_type = "video";
    }

    const fileName = file.originalname
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9-_]/g, "")
      .split(".")
      .slice(0, -1)
      .join("");

    return {
      folder,
      resource_type,
      public_id: `${Date.now()}-${fileName}`,
    };
  },
});

const fileFilter = (req, file, cb) => {
  const mime = file.mimetype;

  // ✅ allow all images, videos, and PDFs
  if (
    mime.startsWith("image/") ||
    mime.startsWith("video/") ||
    mime === "application/pdf"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only image, PDF & video files allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 * 1024, // ✅ 100MB for videos
  },
});

export default upload;
