import Intern from "../model/RegisterDB/internSchema.js"


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





