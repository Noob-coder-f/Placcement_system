import mongoose from "mongoose";

const jobApplicationSchema = new mongoose.Schema(
  {
    /* ===============================
       RELATION INFO
    =============================== */
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobPost",
      required: true,
      index: true,
    },

    applicantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Intern", // or User
      required: true,
      index: true,
    },

    /* ===============================
       BASIC FORM FIELDS
    =============================== */
    full_name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
    },

    mobile_number: {
      type: String,
      required: true,
    },

    resume: {
      url: String,
      fileName: String,
      fileType: String,
    },

    /* ===============================
       DYNAMIC CUSTOM FIELD ANSWERS
    =============================== */
    customFieldAnswers: [
      {
        fieldKey: {
          type: String,
          required: true,
        },

        label: String,

        fieldType: {
          type: String,
          enum: [
            "text",
            "email",
            "number",
            "phone",
            "url",
            "file",
            "textarea",
            "select",
            "radio",
            "checkbox",
            "date",
          ],
        },

        value: mongoose.Schema.Types.Mixed,
      },
    ],

    /* ===============================
       APPLICATION STATUS
    =============================== */
    status: {
      type: String,
      enum: ["Applied", "Reviewed", "Shortlisted", "Rejected", "Hired"],
      default: "Applied",
    },

    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("JobApplication", jobApplicationSchema);
