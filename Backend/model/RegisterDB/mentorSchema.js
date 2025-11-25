import mongoose from "mongoose";

const mentorSchema = new mongoose.Schema(
  {
    // 👤 Basic Details
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },

    // 🔐 Authentication
    password: { type: String, required: true },
    role: {
      type: String,
      default: "mentor",
    },

    // 💼 Professional Details
    experience: { type: Number }, // years
    linkedinUrl: { type: String },
    githubUrl: { type: String },


    // 📂 Optional fields
    domain: [{ type: String }], // e.g., MERN, AI, ML, DevOps
    profileImage: { type: String }, // Cloudinary URL
    isactive: { type: Boolean, default: true },


  },  
  { timestamps: true }
);

const Mentor = mongoose.model("Mentor", mentorSchema, "Mentors");

export default Mentor;
