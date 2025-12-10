import express from "express"
import {
    getMentorProfile,
    updateMentorProfile,
    uploadProfileImage,
    getMentorStudyMaterials,
    deleteStudyMaterial,
    uploadStudyMaterial,


    getMentorVideos,
    updateVideoLecture,
    uploadVideoLecture,
    deleteVideoLecture,


    getMentorInterns,
    submitMentorFeedback,


    getMentorDashboard,


    getMentorClasses,
    createMentorClass,
    updateMentorClass,
    deleteMentorClass

} from "../controller/MentorController.js"



import { authMiddleware } from "../middlewares/authMiddleware.js"
import upload from "../middlewares/upload.js"


const router = express.Router()

router.get("/mentors/dashboard", authMiddleware, getMentorDashboard)


//Profile routes

router.get("/mentors/profile", authMiddleware, getMentorProfile)
router.put("/mentors/profile", authMiddleware, updateMentorProfile)
router.post("/upload/profile-image", authMiddleware, upload.single("profileImage"), uploadProfileImage)

//Study material routes

router.get("/mentor/study-materials", authMiddleware, getMentorStudyMaterials)
router.post("/mentor/study-materials/upload", authMiddleware, upload.single("file"), uploadStudyMaterial)
router.delete("/mentor/study-materials/:id", authMiddleware, deleteStudyMaterial)

//Mentor Video lecture routes

router.get("/mentors/videos", authMiddleware, getMentorVideos)
router.post("/mentors/videos/upload", authMiddleware, upload.fields([{ name: "video", maxCount: 1 },{ name: "thumbnail", maxCount: 1 },]) , uploadVideoLecture)
router.put("/mentors/videos/:id", authMiddleware, upload.fields([{ name: "video", maxCount: 1 },{ name: "thumbnail", maxCount: 1 },]) , updateVideoLecture)
router.delete("/mentors/videos/:id", authMiddleware, deleteVideoLecture)

//user Routes

router.get("/mentors/interns", authMiddleware, getMentorInterns)
router.post("/mentors/feedback", authMiddleware, submitMentorFeedback)



// classes routes 


router.get("/mentors/classes", authMiddleware, getMentorClasses);
router.post("/mentors/classes", authMiddleware, createMentorClass);
router.put("/mentors/classes/:id", authMiddleware, updateMentorClass);
router.delete("/mentors/classes/:id", authMiddleware, deleteMentorClass);




export default router