import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";

export const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [accountType, setAccountType] = useState("");
  const [department, setDepartment] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post("/api/auth/register", {
        fullName,
        email,
        accountType,
        department,
        password,
      });

      localStorage.setItem("token", response.data.token);
      console.log(response)
      if(response.data.role === "student") {
        navigate("/studentDashboard");
      } else if(response.data.role === "teacher") {
        navigate("/facultyDashboard");
      } 
    } catch (err) {
      console.error(err);
      alert("Signup failed, please try again!");
    }
  };

  return (
    <div className="bg-slate-100 h-screen flex justify-center items-center">
      <div className="bg-white shadow-md rounded-lg w-96 p-6">
        <Heading label="Create Account" />
        <SubHeading label="Join Smart Student Hub today" />

        <InputBox
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Enter your full name"
          label="Full Name"
        />

        <InputBox
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          label="Email"
        />

        {/* Account Type Dropdown */}
        <div className="text-left mt-2">
          <label className="block text-sm font-medium text-gray-700">
            Account Type
          </label>
          <select
            value={accountType}
            onChange={(e) => setAccountType(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md"
          >
            <option value="">Select account type</option>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        </div>

        {/* Department Dropdown */}
        <div className="text-left mt-2">
          <label className="block text-sm font-medium text-gray-700">
            Department
          </label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md"
          >
            <option value="">Select department</option>
            <option value="cse">Computer Science</option>
            <option value="ece">Electronics</option>
            <option value="mech">Mechanical</option>
            <option value="civil">Civil</option>
          </select>
        </div>

        <InputBox
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Create a password"
          label="Password"
          type="password"
        />

        <InputBox
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm your password"
          label="Confirm Password"
          type="password"
        />

        <div className="pt-4">
          <Button onClick={handleSignup} label="Create Account" />
        </div>

        <BottomWarning
          label="Already have an account?"
          buttonText="Sign in"
          to="/signin"
        />
      </div>
    </div>
  );
};
