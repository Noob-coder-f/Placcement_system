import express from "express"
import {
    getInternProfile,
    updateInternProfile,
    getInternClasses,


    getStudyMaterials,
    searchStudyMaterials,

    getVideoLectures 
} from "../controller/InternController.js"
import { authMiddleware } from "../middlewares/authMiddleware.js"


const router = express.Router()



router.get("/intern/profile", authMiddleware, getInternProfile)
router.get("/intern/classes", authMiddleware, getInternClasses)
router.put("/intern/profile", authMiddleware, updateInternProfile)

router.get("/intern/study-materials", authMiddleware, getStudyMaterials)
router.get("/intern/study-materials/search", authMiddleware, searchStudyMaterials)

router.get("/intern/video-lectures", authMiddleware, getVideoLectures)



export default router