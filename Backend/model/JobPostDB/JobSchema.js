import mongoose from "mongoose";

const jobPostSchema = new mongoose.Schema(
    {
        /* ===============================
           BASIC JOB INFO
        =============================== */
        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
            trim: true,
        },

        jobType: {
            type: String,
            enum: ["Full-Time", "Part-Time", "Internship", "Contract", "Freelance"],
            required: true,
        },

        location: {
            type: String,
            required: true,
        },

        workMode: {
            type: String,
            enum: ["Onsite", "Remote", "Hybrid"],
            default: "Onsite",
        },

        /* ===============================
           SKILLS & REQUIREMENTS
        =============================== */
        requiredSkills: [
            {
                type: String,
                trim: true,
            },
        ],

        experienceRequired: {
            min: {
                type: Number,
                default: 0,
            },
            max: {
                type: Number,
            },
        },

        qualifications: {
            type: String,
        },

        /* ===============================
           SALARY INFO
        =============================== */
        salary: {
            min: Number,
            max: Number,
            currency: {
                type: String,
                default: "INR",
            },
            isNegotiable: {
                type: Boolean,
                default: false,
            },
        },

        /* ===============================
           COMPANY & HR INFO
        =============================== */
        companyName: {
            type: String,
            required: true,
        },
        /* ===============================
           APPLICATION SETTINGS
        =============================== */
        applicationDeadline: {
            type: Date,
        },

        totalVacancies: {
            type: Number,
            default: 1,
        },

        applicantsCount: {
            type: Number,
            default: 0,
        },

        status: {
            type: String,
            enum: ["Open", "Closed"],
            default: "Open",
        },

        isActive: {
            type: Boolean,
            default: true,
        },

        customFields: [
            {
                fieldKey: {
                    type: String,
                    required: true,
                    lowercase: true,
                    trim: true,
                },

                label: {
                    type: String,
                    required: true,
                },

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
                        "date"
                    ],
                    required: true,
                },

                placeholder: {
                    type: String,
                },

                required: {
                    type: Boolean,
                    default: false,
                },

                options: [
                    {
                        label: String,
                        value: String,
                    },
                ], // Only for select, radio, checkbox

                validation: {
                    minLength: Number,
                    maxLength: Number,
                    minValue: Number,
                    maxValue: Number,
                    regex: String, // email / phone validation
                    fileTypes: [String], // resume: ["pdf", "docx"]
                    maxFileSizeMB: Number,
                },

                defaultValue: mongoose.Schema.Types.Mixed,

                order: {
                    type: Number,
                    default: 0, // form sequence
                },
            },
        ],

    },
    {
        timestamps: true,
    }
);

export default mongoose.model("JobPost", jobPostSchema);
