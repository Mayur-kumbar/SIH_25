import { Router } from "express";
import { protect, authorizeRoles } from "../middlewares/auth.middleware.js";
import Activity from "../models/activity.model.js";
import { upload } from "../middlewares/multer.middleware.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { approveActivity, getMyActivities, getPendingActivities, getProcessedActivities, rejectActivity } from "../controllers/activity.controller.js";


const router = Router();

router.post(
  "/upload",
  protect,
  authorizeRoles("student"),
  upload.fields([
    {
      name: "proof",
      maxCount: 1,
    },
  ]),
  async (req, res) => {
    try {
      const { title, category, description } = req.body;

      if (!req.files || !req.files.proof || req.files.proof.length === 0) {
        return res.status(400).json({ message: "Proof file is required" });
      }

      console.log("Received upload request");
      console.log("Files:", req.files);
      console.log("Body:", req.body);
      const cloudinaryResult = await uploadOnCloudinary(
        req.files.proof[0].path
      );
      if (!cloudinaryResult) {
        return res.status(500).json({ message: "Cloudinary upload failed" });
      }

      const activity = await Activity.create({
        student: req.user._id,
        title,
        category,
        description,
        proofUrl: cloudinaryResult.secure_url,
      });

      res.status(201).json({ message: "Activity submitted", activity });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

router.put(
  "/:id/approve",
  protect,
  authorizeRoles("teacher"),
  approveActivity
);

router.put("/:id/reject", protect, authorizeRoles("teacher"), rejectActivity);

router.get("/my", protect, authorizeRoles("student"), getMyActivities);

router.get("/pending", protect, authorizeRoles("teacher"), getPendingActivities);

router.get("/processed-by-me", protect, authorizeRoles("teacher"), getProcessedActivities)

export default router;
