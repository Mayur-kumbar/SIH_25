import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    accountType: {
      type: String,
      enum: ["student", "teacher"], 
      default: "student",
    },
    department: {
      type: String,
      enum: ["cse", "ece", "mech", "civil"], 
      required: function () {
        return this.accountType === "student" || this.accountType === "teacher";
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    USN: {
      type: String,
      unique: true,
      // sparse: true,
      uppercase: true,
    },
    phoneNumber: {
      type: Number,
      unique: true,
      // sparse: true,
    },
    semester: {
      type: Number,
      min: 1,
      max: 8,
    },
    currentYear: {
      type: Number,
      min: 1,
      max: 4,
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
