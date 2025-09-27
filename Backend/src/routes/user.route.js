import { Router } from "express";
import { getProfile, updateProfile } from "../controllers/user.controller.js";
import { authorizeRoles, protect } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/me", protect, getProfile);
router.put("/update", protect, authorizeRoles("student"), updateProfile)

export default router;