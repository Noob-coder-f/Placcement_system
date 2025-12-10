import mongoose from "mongoose";

const hiringTeamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    bio:{
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password:{
      type: String
    },

    phone: {
      type: String,
    },

    role :{
        type: String,  
        default: "HiringTeam"
    },

    profileImage: {
      type: String, // Cloudinary or server image URL
      required: true,
    },

    experience: {
      type: Number, // years of experience
      default: 0,
    },

    isactive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("HiringTeam", hiringTeamSchema);
