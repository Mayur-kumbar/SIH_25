import React from "react";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-100">
      <h1 className="text-4xl font-bold mb-4">Welcome to SIH Portal</h1>
      <p className="text-lg mb-8">A platform for students and faculty to manage achievements and profiles.</p>
      <div className="flex gap-4">
        <a href="/signin" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Sign In</a>
        <a href="/signup" className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700">Sign Up</a>
      </div>
    </div>
  );
};

export default Home;
