import React, { useState, useEffect } from "react";
import {
  Upload,
  Eye,
  List,
  Plus,
  Bell,
  Home,
  BarChart3,
  Settings,
  Award,
  Calendar,
  FileText,
} from "lucide-react";
import AchievementUpload from "../components/AchievementUpload";
import axios from "axios";
import ViewDetails from "../components/ViewDetails";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function SmartStudentHub() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [totalAchievements, setTotalAchievements] = useState(0);
  const [approvedAchievements, setApprovedAchievements] = useState(0);
  const [pendingAchievements, setPendingAchievements] = useState(0);
  const [activities, setActivities] = useState([]);
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);

  const navigate = useNavigate();

  const getData = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/signin";
      return;
    }

    try {
      const response = await axios.get("/api/activity/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTotalAchievements(response.data.count);
      setApprovedAchievements(
        response.data.activities.filter((act) => act.status === "approved")
          .length
      );
      setPendingAchievements(
        response.data.activities.filter((act) => act.status === "pending")
          .length
      );
      setActivities(response.data.activities);

      console.log("Fetched activities:", response);
    } catch (err) {
      console.error("Error fetching activities:", err);
    }
  };

  const getProfile = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/signin";
      return;
    }

    try {
      const response = await axios.get("/api/user/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(response.data.user);
      console.log("Fetched user profile:", response);
    } catch (err) {
      console.error("Error fetching user profile:", err);
    }
  };

  useEffect(() => {
    getData();
    getProfile();
  }, []);

  const stats = [
    {
      label: "Total Achievements",
      value: totalAchievements,
      sublabel: "All live achievements",
      color: "bg-blue-50",
    },
    {
      label: "Approved",
      value: approvedAchievements,
      sublabel: "Verified achievements",
      color: "bg-green-50",
    },
    {
      label: "Pending Approval",
      value: pendingAchievements,
      sublabel: "Waiting faculty review",
      color: "bg-yellow-50",
    },
  ];

  const upcomingDeadlines = [
    { title: "Portfolio Review", date: "Tomorrow", type: "Review" },
    { title: "NAAC Documentation", date: "5 days", type: "Submission" },
  ];

  // Helper for status color
  const getStatusClass = (status) => {
    if (status === "approved") return "text-green-600 bg-green-100";
    if (status === "pending") return "text-yellow-600 bg-yellow-100";
    if (status === "rejected") return "text-red-600 bg-red-100";
    return "text-gray-600 bg-gray-100";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Navbar setUploadOpen={setUploadOpen} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.fullName}!
          </h1>
          <p className="text-gray-600">
            Track your achievements and build your academic portfolio
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className={`${stat.color} p-6 rounded-xl border`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {stat.sublabel}
                      </p>
                      {stat.trend && (
                        <p className="text-xs text-green-600 mt-1">
                          {stat.trend} from last month
                        </p>
                      )}
                    </div>
                    <div className="w-8 h-8 bg-white bg-opacity-50 rounded-lg flex items-center justify-center">
                      {index === 0 && (
                        <Award size={16} className="text-blue-600" />
                      )}
                      {index === 1 && (
                        <FileText size={16} className="text-green-600" />
                      )}
                      {index === 2 && (
                        <Calendar size={16} className="text-yellow-600" />
                      )}
                      {index === 3 && (
                        <BarChart3 size={16} className="text-purple-600" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Achievements */}
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Recent Achievements
                </h2>
                <button
                  className="bg-teal-600 text-white hover:cursor-pointer px-4 py-2 rounded-lg text-sm font-medium flex items-center"
                  onClick={() => setUploadOpen(true)}
                >
                  <Plus size={16} className="mr-2" />
                  Add Achievement
                </button>
              </div>
              <div className="p-6 space-y-4">
                {activities.length === 0 ? (
                  <p className="text-gray-500 text-sm">
                    No achievements found.
                  </p>
                ) : ( // want to show last 4 activities
                  activities.slice(-4).map((achievement) => (
                    <div
                      key={achievement._id || achievement.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                            <Award size={16} className="text-teal-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {achievement.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {achievement.description}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(
                            achievement.status
                          )}`}
                        >
                          {achievement.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span className="flex items-center">
                          <Calendar size={14} className="mr-1" />
                          {achievement.updatedAt
                            ? new Date(
                                achievement.updatedAt
                              ).toLocaleDateString()
                            : ""}
                        </span>
                        {achievement.approver && (
                          <span>
                            {achievement.approver && achievement.status === "approved" ? "Approved" : "Rejected"} by{" "}
                            {typeof achievement.approver === "object"
                              ? achievement.approver.fullName ||
                                achievement.approver.email
                              : achievement.approver}
                          </span>
                        )}
                      </div>
                      <div className="mt-3 flex space-x-2">
                        <button
                          className="bg-orange-500 text-white px-3 py-1 rounded text-xs font-medium"
                          onClick={() => {
                            setSelectedAchievement(achievement);
                            setViewOpen(true);
                          }}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <ViewDetails
                open={viewOpen}
                onClose={() => setViewOpen(false)}
                achievement={selectedAchievement}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Settings size={20} className="mr-2" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  className="w-full flex items-center px-4 py-3 hover:cursor-pointer bg-teal-50 text-teal-700 rounded-lg hover:bg-teal-100 transition-colors"
                  onClick={() => setUploadOpen(true)}
                >
                  <Upload size={16} className="mr-3" />
                  Upload New Achievement
                </button>
                <button className="w-full flex items-center px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors" 
                  onClick={() => navigate("/profile")}
                >
                  <Eye size={16} className="mr-3" />
                  View Portfolio
                </button>
                <button className="w-full flex items-center px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => navigate("/allAchievements")}
                >
                  <List size={16} className="mr-3" />
                  All Achievements
                </button>
              </div>
            </div>

            {/* Student Information */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Student Information
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Roll Number
                  </p>
                  <p className="text-sm text-gray-900">N/A</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Department
                  </p>
                  <p className="text-sm text-gray-900">{user?.department}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Year</p>
                  <p className="text-sm text-gray-900">N/A</p>
                </div>
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Bell size={20} className="mr-2" />
                Upcoming Deadlines
              </h3>
              <div className="space-y-3">
                {upcomingDeadlines.map((deadline, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {deadline.title}
                      </p>
                      <p className="text-xs text-gray-500">{deadline.type}</p>
                    </div>
                    <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded">
                      {deadline.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Achievement Upload Modal */}
      <AchievementUpload
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUpload={getData}
      />
    </div>
  );
}