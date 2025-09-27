import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  CheckCircle,
  XCircle,
  Eye,
  Search,
  Users,
  Award,
  Clock,
  FileText,
  BarChart3,
  Home,
  Bell,
  Calendar,
  GraduationCap,
  TrendingUp,
  X,
} from "lucide-react";

export default function FacultyDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [user, setUser] = useState(null);
  const [pendingAchievements, setPendingAchievements] = useState([]);
  const [processedAchievements, setProcessedAchievements] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [feedback, setFeedback] = useState("");

  const navigate = useNavigate();

  const getProfile = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      // Redirect to login if no token found
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

  const getPendingActivities = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("/api/activity/pending", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPendingAchievements(
        response.data.map((act) => ({
          id: act._id,
          studentName: act.student?.fullName,
          studentId: act.student?._id,
          title: act.title,
          category: act.category,
          description: act.description,
          date: act.createdAt,
          submittedDate: act.updatedAt,
          status: act.status,
          proofUrl: act.proofUrl,
        }))
      );

      console.log("Fetched pending activities:", response.data);
    } catch (err) {
      console.error("Error fetching pending activities:", err);
    }
  };

  const getProcessedActivities = async() => {
    const token = localStorage.getItem("token")
    try {
      const response = await axios.get("/api/activity/processed-by-me", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setProcessedAchievements(response.data.activities.map((act) => ({
        id: act._id,
        studentName: act.student?.fullName,
        studentId: act.student?._id,
        title: act.title,
        category: act.category,
        description: act.description,
        date: act.createdAt,
        processedDate: act.updatedAt,
        status: act.status,
        proofUrl: act.proofUrl,
        feedback: act.feedback,
        points: act.points,
      })))
      console.log("Fetched processed activities:", response.data)
    } catch (error) {
      console.error("Error fetching processed activities:", error)
    }
  }

  useEffect(() => {
    if(!localStorage.getItem("token")){
      navigate("/signin");
      return;
    }
    getProfile();
    getPendingActivities();
    getProcessedActivities();
  }, []);

  // Handle approval/rejection
  const approveActivity = async (activityId) => {
  const token = localStorage.getItem("token");
  try {
    await axios.put(
      `/api/activity/${activityId}/approve`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    getPendingActivities();
    setShowModal(false);
    alert("Activity approved successfully");
  } catch (err) {
    alert("Failed to approve activity");
  }
};

  const rejectActivity = async(activityId) => {
    const token = localStorage.getItem("token")
    try{
      await axios.put(`/api/activity/${activityId}/reject`, {}, 
        {
          headers: { Authorization: `Bearer ${token}`},
        }
      );
      getPendingActivities();
      setShowModal(false);
      alert("Activity rejected successfully");
    } catch (err) {
      alert("Failed to reject activity");
    }
  }

  const openApprovalModal = (achievement) => {
    setSelectedAchievement(achievement);
    setShowModal(true);
  };

  const stats = {
    pendingReviews: pendingAchievements.length,
    approvedToday: processedAchievements.filter(
      (a) =>
        a.status === "approved" &&
        a.processedDate &&
        new Date(a.processedDate).toLocaleDateString() === new Date().toLocaleDateString()
    ).length,
  };

  // Filter achievements
  const filteredPending = pendingAchievements.filter((achievement) => {
    const matchesSearch =
      achievement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      achievement.studentName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      achievement.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || achievement.category == filterCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredProcessed = processedAchievements.filter((achievement) => {
    const matchesSearch =
      achievement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      achievement.studentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || achievement.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome, {user?.fullName}!
          </h1>
          <p className="text-gray-600 mt-1">
            Review student achievements and manage approvals
          </p>
        </div>
        <div className="flex space-x-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors">
            <Bell size={16} className="mr-2" />
            Notifications ({stats.pendingReviews})
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Pending Reviews
              </p>
              <p className="text-2xl font-bold text-orange-600">
                {stats.pendingReviews}
              </p>
            </div>
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Approved Today
              </p>
              <p className="text-2xl font-bold text-green-600">
                {stats.approvedToday}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Students
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {stats.totalStudents}
              </p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Points</p>
              <p className="text-2xl font-bold text-purple-600">
                {stats.avgPoints}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Recent Pending Achievements */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Pending Reviews
            </h2>
            <button
              onClick={() => setActiveTab("approvals")}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View All
            </button>
          </div>
        </div>
        <div className="p-6">
          {pendingAchievements.slice(0, 3).map((achievement) => (
            <div
              key={achievement._id}
              className="flex items-center justify-between p-4 border rounded-lg mb-4 last:mb-0 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Award size={20} className="text-orange-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    {achievement.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {achievement.studentName} • {achievement.category} •{" "}
                    {achievement.date
                      ? new Date(achievement.date).toLocaleDateString()
                      : ""}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => openApprovalModal(achievement)}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                >
                  Review
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderApprovals = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Achievement Approvals
          </h1>
          <p className="text-gray-600 mt-1">
            Review and approve student achievements
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            {pendingAchievements.length} pending reviews
          </span>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search achievements or students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Categories</option>
          <option value="conference">Conference</option>
          <option value="competition">Competition</option>
          <option value="internship">Internship</option>
          <option value="certification">Certification</option>
        </select>
      </div>

      {/* Pending Achievements */}
      <div className="space-y-4">
        {filteredPending.map((achievement) => (
          <div
            key={achievement.id}
            className="bg-white rounded-xl shadow-sm border p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {achievement.title}
                  </h3>
                  <span className="px-3 py-1 bg-blue-100 text-blue-600 text-sm font-medium rounded-full">
                    {achievement.category}
                  </span>
                 
                </div>

                <div className="mb-3">
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Student:</span>{" "}
                    {achievement.studentName} ({achievement.studentId}) 
                  </p>
                  <p className="text-gray-700">{achievement.description}</p>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Calendar size={14} className="mr-1" />
                    Achievement Date: {achievement.date ? new Date(achievement.date).toLocaleDateString() : ""}
                  </span>
                  <span className="flex items-center">
                    <Clock size={14} className="mr-1" />
                    Submitted: {achievement.submittedDate ? new Date(achievement.submittedDate).toLocaleDateString() : ""}
                  </span>
                  {achievement.proofUrl && (
                    <span className="flex items-center">
                      <FileText size={14} className="mr-1" />
                      Evidence attached
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => openApprovalModal(achievement)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Eye size={16} className="mr-2" />
                Review Details
              </button>
              <button
                onClick={() => approveActivity(achievement.id || achievement._id)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <CheckCircle size={16} className="mr-2" />
                Quick Approve
              </button>
              <button
                onClick={() => rejectActivity(achievement.id || achievement._id)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
              >
                <XCircle size={16} className="mr-2" />
                Quick Reject
              </button>
              {achievement.proofUrl && (
                <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                onClick={() => window.open(achievement.proofUrl, "_blank")}
                >
                  <Eye size={16} className="mr-2" />
                  See Evidence
                </button>
              )}
            </div>
          </div>
        ))}

        {filteredPending.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-green-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              All caught up!
            </h3>
            <p className="text-gray-500">No pending achievements to review</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Review History</h1>
          <p className="text-gray-600 mt-1">
            Previously approved and rejected achievements
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search processed achievements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Processed Achievements */}
      <div className="space-y-4">
        {filteredProcessed.map((achievement) => (
          <div
            key={achievement.id}
            className="bg-white rounded-xl shadow-sm border p-6"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {achievement.title}
                  </h3>
                  <span className="px-3 py-1 bg-blue-100 text-blue-600 text-sm font-medium rounded-full">
                    {achievement.category}
                  </span>
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full ${
                      achievement.status === "approved"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {achievement.status}
                  </span>
                  {achievement.points > 0 && (
                    <span className="px-3 py-1 bg-purple-100 text-purple-600 text-sm font-medium rounded-full">
                      {achievement.points} points
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Student:</span>{" "}
                  {(achievement.studentName ||
                    (achievement.student && achievement.student.fullName) ||
                    "Unknown")} ({achievement.studentId})
                </p>

                <p className="text-sm text-gray-500 mb-2">
                  Processed on: {achievement.processedDate ? new Date(achievement.processedDate).toLocaleDateString() : "N/A"}
                </p>

                {achievement.feedback && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Feedback:
                    </p>
                    <p className="text-sm text-gray-600">
                      {achievement.feedback}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center ml-4">
                {achievement.status === "approved" ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

 

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-1">Achievement statistics and trends</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Approval Statistics
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Reviewed</span>
              <span className="font-bold">{processedAchievements.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Approved</span>
              <span className="font-bold text-green-600">
                {
                  processedAchievements.filter((a) => a.status === "approved")
                    .length
                }
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Rejected</span>
              <span className="font-bold text-red-600">
                {
                  processedAchievements.filter((a) => a.status === "rejected")
                    .length
                }
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Student Performance
          </h3>
          <div className="text-center py-8">
            <BarChart3 className="mx-auto h-16 w-16 text-gray-400 mb-2" />
            <p className="text-gray-500">Analytics charts coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboard();
      case "approvals":
        return renderApprovals();
      case "history":
        return renderHistory();
      case "students":
        return renderStudents();
      case "analytics":
        return renderAnalytics();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <GraduationCap size={18} className="text-white" />
                </div>
                <span className="text-xl font-semibold text-gray-900">
                  Faculty Portal
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
                <button
                className="ml-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow transition"
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  navigate("/signin");
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <div className="w-64 bg-white rounded-xl shadow-sm border p-6">
            <nav className="space-y-2">
              {[
                { name: "Dashboard", tab: "dashboard", icon: Home },
                {
                  name: "Pending Approvals",
                  tab: "approvals",
                  icon: Clock,
                  badge: stats.pendingReviews,
                },
                { name: "Review History", tab: "history", icon: CheckCircle },
                { name: "Analytics", tab: "analytics", icon: BarChart3 },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.name}
                    onClick={() => setActiveTab(item.tab)}
                    className={`w-full flex items-center justify-between px-5 py-3 text-left rounded-lg transition-colors ${
                      activeTab === item.tab
                        ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                        : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                  >
                    <div className="flex items-center">
                      <Icon size={20} className="mr-3" />
                      {item.name}
                    </div>
                    {item.badge && item.badge > 0 && (
                      <span className="bg-orange-100 text-orange-600 text-xs font-medium px-2 py-1 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">{renderContent()}</div>
        </div>
      </div>

      {/* Modal for detailed review */}
      {showModal && selectedAchievement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  Review Achievement
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {selectedAchievement.title}
                  </h3>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-600 text-sm font-medium rounded-full">
                      {selectedAchievement.category}
                    </span>
                    <span className="px-3 py-1 bg-orange-100 text-orange-600 text-sm font-medium rounded-full">
                      {selectedAchievement.points || 0} points
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Student Name
                    </label>
                    <p className="text-gray-900">
                      {selectedAchievement.studentName ||
                        selectedAchievement.student?.fullName}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Student ID
                    </label>
                    <p className="text-gray-900">
                      {selectedAchievement.studentId ||
                        selectedAchievement.student?._id}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Achievement Date
                    </label>
                    <p className="text-gray-900">
                      {selectedAchievement.date
                        ? new Date(
                            selectedAchievement.date
                          ).toLocaleDateString()
                        : ""}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Description
                  </label>
                  <p className="text-gray-900 mt-1">
                    {selectedAchievement.description}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2 block">
                    Proof
                  </label>
                  {selectedAchievement.proofUrl ? (
                    <div className="bg-gray-50 rounded-lg p-4">
                      { (
                        <div className="border-2 border-dashed border-gray-200 rounded-lg p-2 bg-white">
                          <img
                            src={selectedAchievement.proofUrl}
                            alt="Proof"
                            className="w-full max-h-64 object-contain rounded-lg shadow-sm"
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-gray-50 text-gray-500 p-4 rounded-lg text-center italic">
                      No proof attached
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-2">
                    Feedback (optional)
                  </label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Add your feedback here..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => rejectActivity(selectedAchievement.id || selectedAchievement._id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
              >
                <XCircle size={16} className="mr-2" />
                Reject
              </button>
              <button
                onClick={() => approveActivity(selectedAchievement.id || selectedAchievement._id)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <CheckCircle size={16} className="mr-2" />
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
