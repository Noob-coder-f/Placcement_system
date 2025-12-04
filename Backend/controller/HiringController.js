import HiringTeam from "../model/RegisterDB/hiringSchema.js";
import JobPost from "../model/JobPostDB/JobSchema.js";
import Intern from "../model/RegisterDB/internSchema.js";


export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware

    const user = await HiringTeam.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware

    const {
      name,
      email,
      phone,
      experience,
      bio
    } = req.body;

    const updatedUser = await HiringTeam.findByIdAndUpdate(
      userId,
      {
        name,
        email,
        phone,
        experience,
        bio,
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update profile",
    });
  }
};


export const uploadProfileImage = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file uploaded",
      });
    }

    // ✅ Cloudinary URL is available here
    const imageUrl = req.file.path;

    const updatedUser = await HiringTeam.findByIdAndUpdate(
      userId,
      { profileImage: imageUrl },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Profile image uploaded successfully",
      imageUrl,
      data: updatedUser,
    });
  } catch (error) {
    console.error("Image upload error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Image upload failed",
    });
  }
};









export const createJobPost = async (req, res) => {
  try {
    const job = await JobPost.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Job created successfully",
      data: job,
    });

  } catch (error) {
    console.error("Create Job Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const getAllJobPosts = async (req, res) => {
  try {
    const jobs = await JobPost.find()
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      data: jobs,
    });

  } catch (error) {
    console.error("Fetch Jobs Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
    });
  }
};



export const getJobById = async (req, res) => {
  try {
    const job = await JobPost.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: job,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


export const updateJob = async (req, res) => {
  try {
    const updatedJob = await JobPost.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        customFields: req.body.customFields || [],
        salary: req.body.salary || {},
      },
      { new: true, runValidators: true }
    );

    if (!updatedJob) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Job updated successfully",
      data: updatedJob,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


export const updateJobStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Open", "Closed"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const isActive = status === "Open";

    const updatedJob = await JobPost.findByIdAndUpdate(
      req.params.id,
      {
        status,
        isActive,
      },
      { new: true }
    );

    if (!updatedJob) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Job ${status === "Open" ? "opened" : "closed"} successfully`,
      data: updatedJob,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const getAllInterns = async (req, res) => {
  try {
    const interns = await Intern.find({ isActive: true })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: interns
    });
  } catch (error) {
    console.error("Get Interns Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch interns"
    });
  }
};


export const submitHiringFeedback = async (req, res) => {
  try {
    const { rating, comment, improvementSuggestions } = req.body;
    const internId = req.params.id;

    if (!rating) {
      return res.status(400).json({
        success: false,
        message: "Rating is required"
      });
    }

    const intern = await Intern.findById(internId);
    if (!intern) {
      return res.status(404).json({
        success: false,
        message: "Intern not found"
      });
    }

    intern.hiringTeamFeedback.push({
      rating,
      comment,
      improvementSuggestions
    });

    await intern.save();

    res.status(200).json({
      success: true,
      message: "Feedback submitted successfully"
    });

  } catch (error) {
    console.error("Feedback Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit feedback"
    });
  }
};