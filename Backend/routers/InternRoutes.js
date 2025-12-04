import express from "express"
import {
    getInternProfile,
    updateInternProfile,
    getInternClasses,


    getStudyMaterials,
    searchStudyMaterials,

    getVideoLectures ,
    getDashboardStats,
    
    getRecentFeedback,
    getRecentJobPosts
} from "../controller/InternController.js"
import { authMiddleware } from "../middlewares/authMiddleware.js"


const router = express.Router()



router.get("/intern/profile", authMiddleware, getInternProfile)
router.get("/intern/classes", authMiddleware, getInternClasses)
router.put("/intern/profile", authMiddleware, updateInternProfile)

router.get("/intern/study-materials", authMiddleware, getStudyMaterials)
router.get("/intern/study-materials/search", authMiddleware, searchStudyMaterials)

router.get("/intern/video-lectures", authMiddleware, getVideoLectures)


router.get("/intern/dashboard-stats", authMiddleware, getDashboardStats)
router.get("/intern/recent-feedback", authMiddleware, getRecentFeedback)
router.get("/intern/recent-job-posts", authMiddleware, getRecentJobPosts)



export default router