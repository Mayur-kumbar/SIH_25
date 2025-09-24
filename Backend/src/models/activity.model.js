import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      enum: ["conference", "certification", "internship", "competition"],
      required: true,
    }, 
    description: {
      type: String,
      required: true,
    }, 
    proofUrl: { 
      type: String,
      required: true, 
    },
    approver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true } 
);

export default mongoose.model("Activity", activitySchema);
