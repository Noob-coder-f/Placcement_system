import mongoose from "mongoose";

const internSchema = new mongoose.Schema({
  // 👤 Basic Details

  uniqueId: { type: String, required: true }, // e.g., university roll no
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true }, // bcrypt hashed

  // 🎓 Academic Info
  college: { type: String, required: true },
  course: { type: String, required: true },
  yearOfStudy: { type: Number, required: true },
  domain: { type: String },

  // 💼 Professional Info
  skills: [{ type: String, required: true }],
  resumeUrl: { type: String },
  linkedinUrl: { type: String },
  githubUrl: { type: String },

  // 🧩 Internship Details
  
  appliedFor: [{ type: String }],


mentorFeedback: [
  {
    comment: { type: String },
    rating: { type: Number, min: 1, max: 5 },
    date: { type: Date, default: Date.now },
    improvementSuggestions: { type: String },
  }
],

hiringTeamFeedback: [
  {
    comment: { type: String },
    rating: { type: Number, min: 1, max: 5 },
    date: { type: Date, default: Date.now },
    improvementSuggestions: { type: String },
  }
],


  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],

    // 🌟 Free Job Limit & Payments
  freeJobLimit: { type: Number, default: 2 },
  jobsAppliedCount: { type: Number, default: 0 },

  jobCredits: { type: Number, default: 0 },
  planCategory: { type: String, default: "NONE" },

  paymentHistory: [
    {
      amount: Number,
      currency: { type: String, default: "INR" },
      date: { type: Date, default: Date.now },
      paymentId: String,
      status: String,
      planPurchased: String,
    }
  ],

  // ⚙️ Misc
  isActive: { type: Boolean, default: true },

}, { timestamps: true });

const Intern = mongoose.models.Intern || mongoose.model("Intern", internSchema, "Intern");
export default Intern;
