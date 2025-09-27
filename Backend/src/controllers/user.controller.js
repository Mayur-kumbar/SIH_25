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

    console.log(newUser);
    

    const token = jwt.sign(
      { id: newUser._id, role: newUser.accountType },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
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


const loginUser = asyncHandler(async(req, res) => {
   try {
    const { email, password } = req.body;
    // console.log(req.body);
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // console.log("user: ", user);
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.accountType },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.accountType,
        department: user.department,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
})

const updateProfile = asyncHandler(async(req, res) => {
  try {
    const { fullName, USN, phoneNumber, semester, currentYear, department} = req.body;
    
    const user = await User.findById(req.user.id)
    if(!user) return res.status(404).json({message: "User not found"})
    
    user.fullName = fullName || user.fullName
    user.USN =  USN || user.USN
    user.phoneNumber = phoneNumber || user.phoneNumber
    user.semester = semester || user.semester
    user.currentYear = currentYear || user.currentYear
    user.department = department || user.department

    await user.save()

    res.status(200).json({message: "Profile updated successfully", user})
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
})

const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.status(200).json({ user });
});

export {
  registerUser,
  loginUser,
  getProfile,
  updateProfile
}