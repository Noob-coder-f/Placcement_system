import Intern from "../model/RegisterDB/internSchema.js"
import Class from "../model/MentorDB/classes.js"
import StudyMaterial from "../model/MentorDB/studyMaterial.js"
import VideoLecture from "../model/MentorDB/VideoLectures.js"


export const getInternProfile = async (req, res) => {
  try {
    const internId = req.user.id;

    const intern = await Intern.findById(internId).select("-password");

    if (!intern) {
      return res.status(404).json({ message: "Intern not found" });
    }

    res.json(intern);
  } catch (error) {
    console.error("Error getting profile:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


export const updateInternProfile = async (req, res) => {
  try {
    const internId = req.user.id;
    let updateData = {};

    if (req.file) {
      // File upload
      if (req.file.fieldname === "resume") {
        updateData.resumeUrl = req.file.path;
      } else if (req.file.fieldname === "profileImage") {
        updateData.profileImage = req.file.path;
      }
    } else {
      updateData = req.body || {};
    }

    const intern = await Intern.findById(internId);
    if (!intern) {
      return res.status(404).json({ message: "Intern not found" });
    }

    // ----- SAFE SKILLS HANDLING -----
    if (updateData && updateData.skills !== undefined) {
      let rawSkills = updateData.skills;

      if (typeof rawSkills === "string") {
        try {
          rawSkills = JSON.parse(rawSkills);
        } catch (err) {
          rawSkills = [rawSkills];
        }
      }

      if (Array.isArray(rawSkills)) {
        intern.skills = rawSkills
          .map(skill => {
            if (typeof skill === "string") return { name: skill };
            if (skill?.name) return { name: skill.name };
            return null;
          })
          .filter(Boolean);
      }
    }

    // ----- Update other fields -----
    const fields = [
      "name", "phone", "college", "course", "yearOfStudy",
      "domain", "linkedinUrl", "githubUrl", "resumeUrl", "profileImage"
    ];

    fields.forEach(field => {
      if (updateData[field] !== undefined) {
        intern[field] = updateData[field];
      }
    });

    await intern.save();

    res.json({
      message: "Profile updated successfully",
      intern
    });

  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server Error" });
  }
};




export const getInternClasses = async (req, res) => {
   try {
    const classes = await Class.find().sort({ startTime: 1 });

    res.json({
      success: true,
      classes: classes.map(cls => ({
        _id: cls._id,
        title: cls.title,
        description: cls.description,
        subject: cls.subject,
        classType: cls.classType,
        meetingLink: cls.meetingLink,
        startTime: cls.startTime,
        endTime: cls.endTime,
        thumbnailUrl: cls.thumbnailUrl
      }))
    });
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching classes'
    });
  }
}



export const getStudyMaterials = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    const total = await StudyMaterial.countDocuments();

    const materials = await StudyMaterial.find()
      
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      materials,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Fetch materials error:", error);
    res.status(500).json({ message: "Failed to fetch study materials" });
  }
};



export const searchStudyMaterials = async (req, res) => {
  try {
    const query = req.query.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    if (!query) {
      return res.status(200).json({
        materials: [],
        totalPages: 1,
        currentPage: 1,
      });
    }

    const filter = {
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { subject: { $regex: query, $options: "i" } },
      ],
    };

    const total = await StudyMaterial.countDocuments(filter);

    const materials = await StudyMaterial.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      materials,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Search failed" });
  }
};



export const getVideoLectures = async (req, res) => {
  try {
    const videos = await VideoLecture.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      videos: videos.map(video => ({
        id: video._id,
        title: video.title,
        description: video.description,
        subject: video.subject,
        thumbnail: video.thumbnailUrl,
        duration: video.duration,
        videoUrl: video.videoUrl
      }))
    });
  } catch (error) {
    console.error('Get Video Lectures Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch video lectures'
    });
  }
};