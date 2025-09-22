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
      enum: ["Computer Science", "Electronics", "Mechanical", "Civil"], 
      required: function () {
        return this.accountType === "student" || this.accountType === "teacher";
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
