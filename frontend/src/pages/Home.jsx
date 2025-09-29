import React from "react";


const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-slate-200 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white shadow flex justify-between items-center px-8 py-4">
        <div className="text-2xl font-bold text-blue-700">Student Portal</div>
        <div className="flex gap-6">
          <a href="/" className="text-blue-700 hover:underline font-medium">Home</a>
          <a href="/signin" className="text-blue-700 hover:underline font-medium">Sign In</a>
          <a href="/signup" className="text-blue-700 hover:underline font-medium">Sign Up</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-1 flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl font-extrabold text-blue-800 mb-6 drop-shadow-lg">Welcome to Student Portal</h1>
        <p className="text-xl text-slate-700 mb-8 max-w-xl">
          Empowering students and faculty to manage achievements, profiles, and more. Join us to experience a seamless platform for academic excellence and collaboration.
        </p>
        <div className="flex gap-6">
          <a href="/signin" className="px-8 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">Sign In</a>
          <a href="/signup" className="px-8 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition">Sign Up</a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white text-center py-4 shadow mt-auto">
        <span className="text-slate-500">&copy; {new Date().getFullYear()} developed by STACK OVERLORDS</span>
      </footer>
    </div>
  );
};

export default Home;
