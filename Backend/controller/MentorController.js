import Mentor from "../model/RegisterDB/mentorSchema.js"
import { v2 as cloudinary } from "cloudinary";



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
