import express from "express"
import { getMentorProfile, updateMentorProfile, uploadProfileImage } from "../controller/MentorController.js"
import { authMiddleware } from "../middlewares/authMiddleware.js"
import { upload } from "../middlewares/upload.js"


const router = express.Router()


router.get("/mentors/profile", authMiddleware, getMentorProfile)
router.put("/mentors/profile", authMiddleware, updateMentorProfile)
router.post("/upload/profile-image", authMiddleware, upload.single("profileImage"), uploadProfileImage)



export default router