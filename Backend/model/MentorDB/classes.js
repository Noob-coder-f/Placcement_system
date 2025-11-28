import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
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

  classType: {
    type: String,
    default: "online",
  },

  meetingLink: {
    type: String,
    default: "", // Google Meet / Zoom / Teams
  },

  startTime: {
    type: Date,
    required: true, // Example: "2025-11-24T10:00:00"
  },

  endTime: {
    type: Date,
    required: true,
  },

  thumbnailUrl: {
    type: String,
    default: "",
  },


}, { timestamps: true });

export default mongoose.model("Class", classSchema);
