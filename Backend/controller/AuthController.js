import Intern from "../model/RegisterDB/internSchema.js";
import Mentor from "../model/RegisterDB/mentorSchema.js";
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

    // 🔍 Check required fields
    if (!name || !email || !phone || !password || !college || !course || !yearOfStudy) {
      return res.status(400).json({ message: "All required fields must be filled." });
    }

    // 🔍 Check for existing email
    const existingUser = await Intern.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    let profileImage = "";
    if (req.file) {
      profileImage = req.file.path;
    }

    // 📝 Create new intern
    const newIntern = new Intern({
      name,
      email,
      phone,
      password: hashedPassword,
      college,
      course,
      yearOfStudy,
      domain,
      skills: skills || [],
      resumeUrl,
      linkedinUrl,
      githubUrl,
      profileImage,
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