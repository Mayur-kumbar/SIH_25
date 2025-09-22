import { asyncHandler } from "../utils/asyncHandler.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js"

const registerUser = asyncHandler(async(req, res) => {
    try {
    const { fullName, email, accountType, department, password } = req.body;

    if (!fullName || !email || !password || !accountType) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      email,
      accountType,
      department,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, role: newUser.accountType },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      role: newUser.accountType,
      fullName: newUser.fullName,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
})

export default registerUser