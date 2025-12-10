import mongoose from "mongoose";

const internSchema = new mongoose.Schema({
  // 👤 Basic Details
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },

  // 🎓 Academic Info
  college: { type: String, required: true },
  course: { type: String, required: true },
  yearOfStudy: { type: Number, required: true },
  domain: { type: String },

  // 💼 Professional Info
  skills: [
    {
      name: { type: String, required: true }
    }
  ],
  resumeUrl: { type: String },
  linkedinUrl: { type: String },
  githubUrl: { type: String },
  profileImage: { type: String },

  // 🧩 Internship Details

  mentorFeedback: [
    {
      comment: String,
      rating: { type: Number, min: 1, max: 5 },
      date: { type: Date, default: Date.now },
      improvementSuggestions: String
    }
  ],

  hiringTeamFeedback: [
    {
      comment: String,
      rating: { type: Number, min: 1, max: 5 },
      date: { type: Date, default: Date.now },
      improvementSuggestions: String
    }
  ],


  // 🌟 Paid Plans (Silver / Gold / Platinum)
  planCategory: {
    type: String,
    enum: ["SILVER", "GOLD", "PLATINUM", "NONE"],
    default: "NONE"
  },

  // 🎯 Job Credits After Buying a Plan
  jobCredits: { type: Number, default: 0 },  // e.g. SILVER = 10, GOLD = 25, PLATINUM = 50

  // 🔄 Credit Usage History
  creditHistory: [
    {
      action: { type: String }, // e.g. "APPLIED JOB"
      creditsUsed: { type: Number },
      date: { type: Date, default: Date.now },
      jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" }
    }
  ],

  // 💰 Payment History (multiple upgrades allowed)
  paymentHistory: [
    {
      amount: Number,
      currency: { type: String, default: "INR" },
      date: { type: Date, default: Date.now },
      paymentId: String,
      status: String,
      planPurchased: String, // SILVER / GOLD / PLATINUM
    }
  ],

  isActive: { type: Boolean, default: true },

}, { timestamps: true });

export default mongoose.model("Intern", internSchema, "Interns");
