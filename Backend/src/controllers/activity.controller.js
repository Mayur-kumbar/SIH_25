import Activity  from "../models/activity.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


const createActivity = async (req, res) => {
  try {
    const { category, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No proof file uploaded" });
    }

    const uploadResult = await uploadOnCloudinary(req.file.path);
    if (!uploadResult) {
      return res.status(500).json({ message: "File upload failed" });
    }

    const activity = new Activity({
      student: req.user.id, 
      category,
      description,
      proofUrl: uploadResult.secure_url,
    });

    await activity.save();

    res.status(201).json({
      message: "Activity uploaded successfully",
      activity, 
    });
  } catch (error) {
    console.error("Create Activity Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

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


export {
    createActivity,
    getMyActivities,
    updateActivityStatus
}