import Activity from "../models/activity.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import User from "../models/user.model.js";


const getMyActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ student: req.user.id })
      .populate("approver", "fullName email accountType")
      .sort({ createdAt: -1 });

    res.json({
      count: activities.length,
      activities,
    });
  } catch (error) {
    console.error("Fetch Activities Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateActivityStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    activity.status = status;
    activity.approver = req.user.id;
    await activity.save();

    res.json({
      message: `Activity ${status} successfully`,
      activity,
    });
  } catch (error) {
    console.error("Update Activity Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getProcessedActivities = async (req, res) => {
  try {
    const activities = await Activity.find({
      approver: req.user.id,
      status: { $in: ["approved", "rejected"] },
    })
      .populate("student", "fullName email department")
      .sort({ createdAt: -1 });

    res.json({
      count: activities.length,
      activities,
    });
  } catch (error) {
    console.error("Fetch Processed Activities Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const handleUpload = async (req, res) => {
  try {
    const { title, category, description } = req.body;

    if (!req.files || !req.files.proof || req.files.proof.length === 0) {
      return res.status(400).json({ message: "Proof file is required" });
    }

    console.log("Received upload request");
    console.log("Files:", req.files);
    console.log("Body:", req.body);
    const cloudinaryResult = await uploadOnCloudinary(req.files.proof[0].path);
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
};

const approveActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity)
      return res.status(404).json({ message: "Activity not found" });

    activity.status = "approved";
    activity.approver = req.user._id;

    await activity.save();
    res.json({ message: "Activity approved", activity });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const rejectActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity)
      return res.status(404).json({ message: "Activity not found" });

    activity.status = "rejected";
    activity.approver = req.user._id;

    await activity.save();
    res.json({ message: "Activity rejected", activity });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPendingActivities = async (req, res) => {
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
};

export {
  getMyActivities,
  getProcessedActivities,
  getPendingActivities,
  approveActivity,
  rejectActivity,
  updateActivityStatus,
  handleUpload,
};
