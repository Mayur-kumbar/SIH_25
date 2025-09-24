import { Router } from "express";
import { protect, authorizeRoles } from "../middlewares/auth.middleware.js";
import Activity from "../models/activity.model.js";
import { upload } from "../middlewares/multer.middleware.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { getMyActivities } from "../controllers/activity.controller.js";
import User from "../models/user.model.js";

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

// router.put("/:id/approve", protect, authorizeRoles("teacher"), async (req, res) => {
//   try {
//     const activity = await Activity.findById(req.params.id);
//     if (!activity) return res.status(404).json({ message: "Activity not found" });

//     activity.status = "Approved";
//     activity.approver = req.user._id;

//     await activity.save();
//     res.json({ message: "Activity approved", activity });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// router.put("/:id/reject", protect, authorizeRoles("teacher"), async (req, res) => {
//   try {
//     const activity = await Activity.findById(req.params.id);
//     if (!activity) return res.status(404).json({ message: "Activity not found" });

//     activity.status = "Rejected";
//     activity.approver = req.user._id;

//     await activity.save();
//     res.json({ message: "Activity rejected", activity });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

router.get("/my", protect, authorizeRoles("student"), getMyActivities);

router.get("/pending", protect, authorizeRoles("teacher"), async (req, res) => {
  try {
    // Get teacher's department
    const teacher = await User.findById(req.user.id);
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    // Find pending activities where the student's department matches the teacher's
    const activities = await Activity.find({ status: "pending" }).populate({
      path: "student",
      select: "fullName department email",
    });

    // Filter by department
    const filtered = activities.filter(
      (act) => act.student && act.student.department === teacher.department
    );

    res.json(filtered);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
