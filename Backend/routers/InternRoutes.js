import express from "express"
import { getInternProfile, updateInternProfile } from "../controller/InternController.js"
import {authMiddleware} from "../middlewares/authMiddleware.js"


const router = express.Router()


router.get("/intern/profile", authMiddleware, getInternProfile)
router.put("/intern/profile", authMiddleware, updateInternProfile)


export default router