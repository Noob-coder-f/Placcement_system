import Mentor from "../model/RegisterDB/mentorSchema.js"
import StudyMaterial from "../model/MentorDB/studyMaterial.js"
import VideoLecture from "../model/MentorDB/VideoLectures.js"
import Intern from "../model/RegisterDB/internSchema.js"
import Class from "../model/MentorDB/classes.js "


import mongoose from "mongoose";


export const getMentorDashboard = async (req, res) => {
  try {
    const mentorId = req.user.id;

    // Get counts from database
    const materialsCount = await StudyMaterial.countDocuments({ uploadedBy: mentorId });
    const videosCount = await VideoLecture.countDocuments();
    const internsCount = await Intern.countDocuments({ isActive: true });

    // Get recent study materials
    const recentMaterials = await StudyMaterial.find({ uploadedBy: mentorId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title description subject pdfUrl createdAt');

    // Get recent users
    const recentUsers = await Intern.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email college course yearOfStudy domain profileImage');

    const dashboardData = {
      stats: {
        students: internsCount,
        materials: materialsCount,
        videos: videosCount,
        classes: 0, // Add your classes model count if available
        users: internsCount,
        interns: internsCount
      },
      recentMaterials,
      recentUsers
    };

    res.status(200).json(dashboardData);
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};










// controllers/mentorController.js

// ===============================
// 📌 GET MENTOR PROFILE
// ===============================
export const getMentorProfile = async (req, res) => {
  try {
    const mentorId = req.user.id;

    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    res.status(200).json(mentor);
  } catch (error) {
    console.error("Get Profile Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ===============================
// 📌 UPDATE MENTOR PROFILE
// ===============================
export const updateMentorProfile = async (req, res) => {
  try {
    const mentorId = req.user.id;

    const {
      name,
      phone,
      experience,
      linkedinUrl,
      githubUrl,
      domain,
      profileImage,
    } = req.body;

    const updatedMentor = await Mentor.findByIdAndUpdate(
      mentorId,
      {
        name,
        phone,
        experience,
        linkedinUrl,
        githubUrl,
        domain,
        profileImage,
      },
      { new: true }
    );

    res.status(200).json(updatedMentor);
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ===============================
// 📌 UPLOAD PROFILE IMAGE
// ===============================
export const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    res.status(200).json({
      imageUrl: req.file.path, // Cloudinary gives secure_url as path
    });

  } catch (error) {
    console.error("Image Upload Error:", error);
    res.status(500).json({ message: "Image upload failed" });
  }
};


export const uploadStudyMaterial = async (req, res) => {
  try {
    const { title, subject, description } = req.body;

    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "File required" });
    }

    const fileUrl =
      req.file.secure_url ||
      req.file.path ||
      req.file.url;

    if (!fileUrl) {
      console.error("Cloudinary response:", req.file);
      return res.status(400).json({
        message: "Failed to get Cloudinary URL",
      });
    }

    const material = await StudyMaterial.create({
      title,
      subject,
      description,
      pdfUrl: fileUrl,      // ✅ always valid now
      uploadedBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: material,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: error.message });
  }
};



/**
 * ✅ Get Logged-in Mentor Materials
 * GET /api/study-material
 */
export const getMentorStudyMaterials = async (req, res) => {
  try {
    const materials = await StudyMaterial.find({
      uploadedBy: req.user.id,
    })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: materials,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * ✅ Delete Study Material (Owner Only)
 * DELETE /api/study-material/:id
 */
export const deleteStudyMaterial = async (req, res) => {
  try {
    // ✅ Auth guard
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const material = await StudyMaterial.findOne({
      _id: req.params.id,
      uploadedBy: req.user.id, // ✅ FIXED
    });

    if (!material) {
      return res.status(404).json({
        success: false,
        message: "Material not found or unauthorized",
      });
    }

    await material.deleteOne();

    res.status(200).json({
      success: true,
      message: "Study material deleted successfully",
    });
  } catch (error) {
    console.error("Delete Study Material Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




// Video lecture Controllers 



export const getMentorVideos = async (req, res) => {
  try {
    const videos = await VideoLecture.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      videos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch videos",
    });
  }
};




export const uploadVideoLecture = async (req, res) => {
  try {
    const { title, subject, description, duration } = req.body;

    if (!req.files?.video || !req.files?.thumbnail) {
      return res.status(400).json({ message: "Video & thumbnail required" });
    }

    const videoUrl = req.files.video[0].path;
    const thumbnailUrl = req.files.thumbnail[0].path;

    const newVideo = await VideoLecture.create({
      title,
      subject,
      description,
      duration,
      videoUrl,
      thumbnailUrl,
      uploadedBy: req.user.id,
    });

    res.status(201).json(newVideo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Video upload failed" });
  }
};



export const updateVideoLecture = async (req, res) => {
  try {
    const video = await VideoLecture.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    if (video.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const { title, subject, description, duration } = req.body;

    video.title = title || video.title;
    video.subject = subject || video.subject;
    video.description = description ?? video.description;
    video.duration = duration || video.duration;

    if (req.files?.video) {
      video.videoUrl = req.files.video[0].path;
    }

    if (req.files?.thumbnail) {
      video.thumbnailUrl = req.files.thumbnail[0].path;
    }

    await video.save();

    res.status(200).json(video);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Video update failed" });
  }
};


export const deleteVideoLecture = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ 1. Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid video ID" });
    }

    const video = await VideoLecture.findById(id);

    // ✅ 2. Check video exists
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // ✅ 3. Authorization check
    if (video.uploadedBy.toString() !== req.user.id.toString()) {
      return res
        .status(403)
        .json({ message: "You can't delete others uploaded videos" });
    }

    await video.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Video deleted successfully",
      deletedId: id, // ✅ helpful for frontend
    });
  } catch (error) {
    console.error("Delete video error:", error);
    res.status(500).json({ message: "Video deletion failed" });
  }
};




// User Data controllers 



export const getMentorInterns = async (req, res) => {
  try {
    const interns = await Intern.find({ isActive: true })
      .select("-password") // 🔒 hide password
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      interns,
    });
  } catch (error) {
    console.error("Fetch interns error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load interns data",
    });
  }
};


export const submitMentorFeedback = async (req, res) => {
  try {
    const { internId, rating, comment, improvementSuggestions } = req.body;

    // ✅ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(internId)) {
      return res.status(400).json({ message: "Invalid intern ID" });
    }

    if (!rating || !comment) {
      return res.status(400).json({
        message: "Rating and comment are required",
      });
    }

    const intern = await Intern.findById(internId);
    if (!intern) {
      return res.status(404).json({ message: "Intern not found" });
    }

    // ✅ Push mentor feedback
    intern.mentorFeedback.unshift({
      rating,
      comment,
      improvementSuggestions,
      date: new Date(),
    });

    await intern.save();

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      feedback: intern.mentorFeedback[0],
    });
  } catch (error) {
    console.error("Submit feedback error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit feedback",
    });
  }
};





// mentor classes controllers 


export const getMentorClasses = async (req, res) => {
  try {
    const mentorId = req.user.id;
    // Replace with your actual Class model
    const classes = await Class.find().sort({ startTime: 1 });
    res.status(200).json({ classes });
  } catch (error) {
    console.error("Get classes error:", error);
    res.status(500).json({ message: "Failed to fetch classes" });
  }
};

export const createMentorClass = async (req, res) => {
  try {
    const mentorId = req.user.id;
    const classData = { ...req.body, mentorId };
    // Replace with your actual Class model
    const newClass = await Class.create(classData);
    res.status(201).json(newClass);
  } catch (error) {
    console.error("Create class error:", error);
    res.status(500).json({ message: "Failed to create class" });
  }
};

export const updateMentorClass = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ 1. Check ID exists
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Class ID is required",
      });
    }

    // ✅ 2. Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Class ID",
      });
    }

    const updatedClass = await Class.findOneAndUpdate(
      { _id: id },   // ✅ Secure (mentor ownership check)
      { $set: req.body },     // ✅ Prevent accidental overwrite
      { new: true, runValidators: true }
    );

    // ✅ 3. Not found
    if (!updatedClass) {
      return res.status(404).json({
        success: false,
        message: "Class not found or unauthorized",
      });
    }

    res.status(200).json({
      success: true,
      message: "Class updated successfully",
      data: updatedClass,
    });

  } catch (error) {
    console.error("Update class error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update class",
    });
  }
};

export const deleteMentorClass = async (req, res) => {
  try {
    const { id } = req.params;
    // Replace with your actual Class model
    const deletedClass = await Class.findOneAndDelete({ _id: id });
    if (!deletedClass) {
      return res.status(404).json({ message: "Class not found" });
    }
    res.status(200).json({ message: "Class deleted successfully" });
  } catch (error) {
    console.error("Delete class error:", error);
    res.status(500).json({ message: "Failed to delete class" });
  }
};