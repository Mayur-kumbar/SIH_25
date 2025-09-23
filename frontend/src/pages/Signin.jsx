import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

   const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/login", {
        email,
        password
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      console.log(res)
      setMessage("Login successful");
      if(res.data.user.role === "student") {
        navigate("/studentDashboard");
      } else if(res.data.user.role === "faculty") {
        navigate("/facultyDashboard");
      } 
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="bg-slate-300 h-screen flex justify-center items-center">
      <div className="rounded-lg bg-white w-80 text-center p-4">
        <Heading label={"Sign in"} />
        <SubHeading label={"Enter your credentials to access your account"} />
        
        <InputBox
          name="email"
          placeholder="pankaj@gmail.com"
          onChange={(e) => setEmail(e.target.value)}
          label={"Email"}
        />
        
        <InputBox
          name="password"
          placeholder="123456"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          label={"Password"}
        />

        <div className="pt-4">
          <Button onClick={handleSubmit} label={"Sign in"} />
        </div>

        {message && <p className="mt-2 text-red-600">{message}</p>}

        <BottomWarning
          label={"Don't have an account?"}
          buttonText={"Sign up"}
          to={"/signup"}
        />
      </div>
    </div>
  );
};
