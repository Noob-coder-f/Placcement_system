import mongoose from "mongoose";

const videoLectureSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },

  description: {
    type: String,
    default: "",
  },

  subject: {
    type: String,
    required: true,
  },

  thumbnailUrl: {
    type: String,
    required: true, // Thumbnail Cloudinary URL
  },

  videoUrl: {
    type: String,
    required: true, // Video Cloudinary URL
  },


  duration: {
    type: String, // example: "15:32"
    default: "",
  },

  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "mentor",
    required: true
  },

}, { timestamps: true });

export default mongoose.model("VideoLecture", videoLectureSchema);
