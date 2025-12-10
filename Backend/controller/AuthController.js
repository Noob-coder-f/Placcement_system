import Intern from "../model/RegisterDB/internSchema.js";
import Mentor from "../model/RegisterDB/mentorSchema.js";
import HiringTeam from "../model/RegisterDB/hiringSchema.js"
import Admin from "../model/RegisterDB/adminSchema.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


//Intern Authentication Controllers .............................................. 

export const registerIntern = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      college,
      course,
      yearOfStudy,
      domain,
      skills,
      resumeUrl,
      linkedinUrl,
      githubUrl
    } = req.body;

    if (!name || !email || !phone || !password || !college || !course || !yearOfStudy) {
      return res.status(400).json({ message: "All required fields must be filled." });
    }

    const existingUser = await Intern.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let profileImage = "";
    if (req.file) {
      profileImage = req.file.path;
    }

    // ⭐ Parse skills safely
    let parsedSkills = [];

    if (skills) {
      try {
        const rawSkills = JSON.parse(skills);

        parsedSkills = rawSkills.map(s => {
          if (typeof s === "string") return { name: s };
          if (typeof s === "object" && s.name) return s;
          return null;
        }).filter(Boolean);

      } catch (err) {
        console.log("Invalid skills format", err);
      }
    }

    const newIntern = new Intern({
      name,
      email,
      phone,
      password: hashedPassword,
      college,
      course,
      yearOfStudy,
      domain,
      skills: parsedSkills,
      resumeUrl,
      linkedinUrl,
      githubUrl,
      profileImage
    });

    await newIntern.save();

    return res.status(201).json({
      message: "Registration successful",
      intern: {
        id: newIntern._id,
        name: newIntern.name,
        email: newIntern.email
      }
    });

  } catch (error) {
    console.error("Registration Error:", error);
    return res.status(500).json({ message: "Server error during registration" });
  }
};


export const internLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and Password are required" });
    }

    const intern = await Intern.findOne({ email });
    if (!intern) {
      return res.status(404).json({ message: "Intern not found" });
    }

    const isMatch = await bcrypt.compare(password, intern.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Create JWT with role = intern
    const token = jwt.sign(
      {
        id: intern._id,
        role: "intern",
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      message: "Intern logged in successfully",
      token,
      intern: {
        name: intern.name,
        email: intern.email,
      },
    });

  } catch (error) {
    console.error("Intern Login Error =>", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const checkAuth = async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user, // contains { id, role }
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};




//mentor Authentication Controllers ..............................................




export const registerMentor = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      privateKey,
      experience,
      domain,
      linkedinUrl,
      githubUrl
    } = req.body;

    // 1. Check if admin private key correct
    if (privateKey !== process.env.MENTOR_PRIVATE_KEY) {
      return res.status(400).json({ message: "Invalid private key!" });
    }

    // 2. Check existing mentor
    const existing = await Mentor.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Get Cloudinary URL (if image exists)
    let profileImage = "";
    if (req.file) {
      profileImage = req.file.path;
    }

    const mentor = await Mentor.create({
      name,
      email,
      phone,
      password: hashedPassword,
      experience,
      domain,
      linkedinUrl,
      githubUrl,
      profileImage,
    });

    return res.status(201).json({
      message: "Mentor registered successfully",
      mentorId: mentor._id
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Server error during registration",
    });
  }
};


export const loginMentor = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check fields
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // 2. Check mentor exists
    const mentor = await Mentor.findOne({ email });
    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    // 3. Match password
    const isMatch = await bcrypt.compare(password, mentor.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // 4. Create JWT token
    const token = jwt.sign(
      {
        id: mentor._id,
        role: "mentor",
        email: mentor.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );


    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      message: "Login successful",
      token,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};




// Hiring Team authentication .................................................




export const registerHiringTeam = async (req, res) => {
  try {
    const { name, email, phone, role, experience, privateKey, password } = req.body;

    // Check required fields
    if (!name || !email || !privateKey || !password) {
      return res.status(400).json({ message: "Required fields missing." });
    }

    // Check if email already exists
    const existingUser = await HiringTeam.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered." });
    }

    if (privateKey !== process.env.HIRING_TEAM_PRIVET_KEY) {
      return res.status(400).json({ message: "Invalid private key!" });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Image path from multer
    let profileImage = "";
    if (req.file) {
      profileImage = req.file.path;
    }
    // Create new record
    const hiringTeamMember = await HiringTeam.create({
      name,
      email,
      phone,
      role,
      experience,
      password: hashedPassword,
      profileImage
    });

    res.status(201).json({
      message: "Hiring team member registered successfully",
      hiringTeamMember,
    });

  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};



export const loginHiring = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check fields
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // 2. Check mentor exists
    const Hiring = await HiringTeam.findOne({ email });
    if (!Hiring) {
      return res.status(404).json({ message: "HR not found" });
    }

    // 3. Match password
    const isMatch = await bcrypt.compare(password, Hiring.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // 4. Create JWT token
    const token = jwt.sign(
      {
        id: Hiring._id,
        role: "HiringTeam",
        email: Hiring.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );


    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });


    return res.status(200).json({
      message: "Login successful",
      token,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};




//admin authentication .................................................... 

export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, privateKey } = req.body;

    // Validate private key
    if (privateKey !== process.env.ADMIN_PRIVET_KEY) {
      return res.status(401).json({
        success: false,
        message: 'Invalid private key. Registration not authorized.',
      });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin with this email already exists',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new admin
    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
    });

    // Remove password from response
    const adminResponse = {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      createdAt: admin.createdAt
    };

    res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      data: {
        admin: adminResponse
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};



export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check fields
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // 2. Check if user exists
    const user = await Admin.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Debug: Log password field to catch undefined
    if (!user.password) {
      console.error("Error: Password field is missing for user:", user.email);
      return res.status(500).json({ message: "Password not found for this admin. Please check DB." });
    }

    // 3. Match password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // 4. Create JWT token
    const token = jwt.sign(
      {
        id: user._id,
        role: "admin",
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 5. Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      message: "Login successful",
      token,
    });

  } catch (error) {
    console.error("Login Error:", error.message || error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};
