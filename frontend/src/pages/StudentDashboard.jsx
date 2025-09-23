import React, { useEffect, useState } from "react";
import axios from "axios";
import StatCard from "../components/Card";
import AchievementCard from "../components/AchievementsCard";

const StudentDashboard = () => {
  const [stats, setStats] = useState({});
  const [achievements, setAchievements] = useState([]);

  

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Welcome back, Stack!</h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Achievements" value={stats.total} subtext={stats.totalChange} />
        <StatCard title="Approved" value={stats.approved} subtext="Verified achievements" />
        <StatCard title="Pending" value={stats.pending} subtext="Awaiting approval" />
        <StatCard title="Portfolio Score" value={`${stats.portfolioScore}%`} subtext="Completeness rating" />
      </div>

      {/* Achievements Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Achievements</h2>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">+ Add Achievement</button>
        </div>
        <div className="grid gap-4">
          {achievements.map((a) => (
            <AchievementCard key={a.id} achievement={a} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
