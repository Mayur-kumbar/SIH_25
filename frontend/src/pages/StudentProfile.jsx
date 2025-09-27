import React, { useState, useEffect } from "react";
import { User, Clock, BookOpen, BarChart3, Award } from "lucide-react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { Navigate, useNavigate } from "react-router-dom";

export default function StudentProfile() {
  const mockAttendance = {
    overall: 82,
    subjects: [
      { name: "Data Structures", percentage: 88 },
      { name: "Operating Systems", percentage: 76 },
      { name: "DBMS", percentage: 70 },
    ],
  };

  const mockCourses = [
    {
      name: "Data Structures",
      code: "CS201",
      instructor: "Dr. Rao",
      status: "Ongoing",
      progress: 65,
    },
    {
      name: "Operating Systems",
      code: "CS301",
      instructor: "Prof. Sharma",
      status: "Completed",
      progress: 100,
    },
  ];

  const mockResults = [
    {
      semester: "Sem 5",
      gpa: 8.4,
      subjects: [
        { name: "Data Structures", grade: "A" },
        { name: "OS", grade: "B+" },
        { name: "DBMS", grade: "A-" },
      ],
    },
    {
      semester: "Sem 4",
      gpa: 8.0,
      subjects: [
        { name: "Maths IV", grade: "B+" },
        { name: "Networks", grade: "A" },
      ],
    },
  ];

  const mockAchievements = [
    {
      id: 1,
      title: "Best Project Award",
      description:
        "Awarded for outstanding performance in Database Management System project",
      date: "2024-03-15",
      category: "Academic",
      issuer: "Computer Science Department",
    },
    {
      id: 2,
      title: "Hackathon Winner",
      description: "First place in Inter-College Coding Competition 2024",
      date: "2024-02-20",
      category: "Technical",
      issuer: "Tech Fest Committee",
    },
    {
      id: 3,
      title: "Merit Certificate",
      description: "Achieved 85%+ attendance in Semester 4",
      date: "2024-01-10",
      category: "Academic",
      issuer: "Academic Office",
    },
    {
      id: 4,
      title: "Leadership Excellence",
      description: "Led student council activities for academic year 2023-24",
      date: "2024-04-05",
      category: "Leadership",
      issuer: "Student Affairs",
    },
  ];

  // State with mock defaults
  const [user, setUser] = useState({});
  const [attendance, setAttendance] = useState(mockAttendance);
  const [courses, setCourses] = useState(mockCourses);
  const [results, setResults] = useState(mockResults);
  const [achievements, setAchievements] = useState([]);
  const [activeTab, setActiveTab] = useState("profile");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editUser, setEditUser] = useState();

  const navigate = useNavigate();

  const getProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }
    try {
      const res = await axios.get("/api/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.user);
      console.log("Fetched user:", res);
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  const getAttendance = async () => {
    try {
      const res = await axios.get("/api/user/attendance");
      setAttendance(res.data || mockAttendance);
    } catch (err) {
      console.error("Error fetching attendance:", err);
      setAttendance(mockAttendance);
    }
  };

  const getCourses = async () => {
    try {
      const res = await axios.get("/api/user/courses");
      setCourses(res.data.courses || mockCourses);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setCourses(mockCourses);
    }
  };

  const getResults = async () => {
    try {
      const res = await axios.get("/api/user/results");
      setResults(res.data.results || mockResults);
    } catch (err) {
      console.error("Error fetching results:", err);
      setResults(mockResults);
    }
  };

  console.log("Edit User:", editUser);
  const updateProfile = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.put("/api/user/update", editUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.user || editUser);
      setEditMode(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile. Please try again.");
    }
  };

  const fetchActivities = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get("/api/activity/my", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setAchievements(response.data.activities);
  };

  const handleInputChange = (field, value) => {
    setEditUser((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getAchievements = async () => {
    try {
      const res = await axios.get("/api/user/achievements");
      setAchievements(res.data.achievements || mockAchievements);
    } catch (err) {
      console.error("Error fetching achievements:", err);
      setAchievements(mockAchievements);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/signin");
      return;
    }
    getProfile();
    getAttendance();
    getCourses();
    getResults();
    getAchievements();
    fetchActivities();
  }, []);

  useEffect(() => {
    setEditUser(user);
  }, [user]);

  // Helpers
  const getAttendanceClass = (p) =>
    p >= 85
      ? "text-green-600 bg-green-100 px-1.5 py-0.5 rounded text-xs inline-block"
      : p >= 75
      ? "text-yellow-600 bg-yellow-100 px-1.5 py-0.5 rounded text-xs inline-block"
      : "text-red-600 bg-red-100 px-1.5 py-0.5 rounded text-xs inline-block";

  const getGradeClass = (g) =>
    g.startsWith("A")
      ? "text-green-600 bg-green-100 px-1.5 py-0.5 rounded text-xs inline-block"
      : g.startsWith("B")
      ? "text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded text-xs inline-block"
      : "text-red-600 bg-red-100 px-1.5 py-0.5 rounded text-xs inline-block";

  const getCategoryColor = (category) =>
    category === "Academic"
      ? "bg-blue-100 text-blue-800"
      : category === "Technical"
      ? "bg-green-100 text-green-800"
      : category === "Leadership"
      ? "bg-purple-100 text-purple-800"
      : "bg-gray-100 text-gray-800";

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar setUploadOpen={setUploadOpen} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Student Profile
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar Tabs */}
          <div className="bg-white rounded-xl shadow-sm border p-4 space-y-2">
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center px-4 py-2 rounded-lg ${
                activeTab === "profile"
                  ? "bg-teal-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <User size={18} className="mr-2" /> Personal Info
            </button>

            <button
              onClick={() => setActiveTab("attendance")}
              className={`w-full flex items-center px-4 py-2 rounded-lg ${
                activeTab === "attendance"
                  ? "bg-teal-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Clock size={18} className="mr-2" /> Attendance
            </button>

            <button
              onClick={() => setActiveTab("courses")}
              className={`w-full flex items-center px-4 py-2 rounded-lg ${
                activeTab === "courses"
                  ? "bg-teal-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <BookOpen size={18} className="mr-2" /> Courses
            </button>

            <button
              onClick={() => setActiveTab("results")}
              className={`w-full flex items-center px-4 py-2 rounded-lg ${
                activeTab === "results"
                  ? "bg-teal-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <BarChart3 size={18} className="mr-2" /> Results
            </button>

            <button
              onClick={() => setActiveTab("achievements")}
              className={`w-full flex items-center px-4 py-2 rounded-lg ${
                activeTab === "achievements"
                  ? "bg-teal-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Award size={18} className="mr-2" /> My Achievements
            </button>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3 bg-white rounded-xl shadow-sm border p-6">
           {activeTab === "profile" && (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold text-gray-800">
        Personal Information
      </h2>
      {!editMode && (
        <button
          onClick={() => setEditMode(true)}
          className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
        >
          Edit Information
        </button>
      )}
    </div>

    {!editMode ? (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
          <span className="text-gray-500 text-xs font-medium uppercase tracking-wide">Name</span>
          <p className="text-gray-800 font-semibold mt-1">{user.fullName}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
          <span className="text-gray-500 text-xs font-medium uppercase tracking-wide">Semester</span>
          <p className="text-gray-800 font-semibold mt-1">{user.semester}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
          <span className="text-gray-500 text-xs font-medium uppercase tracking-wide">USN</span>
          <p className="text-gray-800 font-semibold mt-1">{user.USN}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
          <span className="text-gray-500 text-xs font-medium uppercase tracking-wide">Current Year</span>
          <p className="text-gray-800 font-semibold mt-1">{user.currentYear}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
          <span className="text-gray-500 text-xs font-medium uppercase tracking-wide">Phone No</span>
          <p className="text-gray-800 font-semibold mt-1">{user.phoneNumber}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
          <span className="text-gray-500 text-xs font-medium uppercase tracking-wide">Department</span>
          <p className="text-gray-800 font-semibold mt-1">{user.department}</p>
        </div>
      </div>
    ) : (
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              value={editUser.fullName}
              onChange={(e) =>
                handleInputChange("fullName", e.target.value)
              }
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Semester
            </label>
            <input
              type="text"
              value={editUser.semester}
              onChange={(e) =>
                handleInputChange("semester", e.target.value)
              }
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              USN
            </label>
            <input
              type="text"
              value={editUser.USN}
              onChange={(e) =>
                handleInputChange("USN", e.target.value)
              }
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Current Year
            </label>
            <input
              type="text"
              value={editUser.currentYear}
              onChange={(e) =>
                handleInputChange("currentYear", e.target.value)
              }
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Phone No
            </label>
            <input
              type="text"
              value={editUser.phoneNumber}
              onChange={(e) =>
                handleInputChange("phoneNumber", e.target.value)
              }
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Department
            </label>
            <input
              type="text"
              value={editUser.department}
              onChange={(e) =>
                handleInputChange("department", e.target.value)
              }
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-gray-800"
            />
          </div>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={updateProfile}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 text-sm font-semibold shadow-sm hover:shadow-md"
          >
            Save Changes
          </button>
          <button
            onClick={() => {
              setEditMode(false);
              setEditUser(user);
            }}
            className="px-6 py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-all duration-200 text-sm font-semibold shadow-sm hover:shadow-md"
          >
            Cancel
          </button>
        </div>
      </div>
    )}
  </div>
)}

            {activeTab === "attendance" && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Attendance</h2>
                <p className="mb-2">
                  Overall:{" "}
                  <span className={getAttendanceClass(attendance.overall)}>
                    {attendance.overall}%
                  </span>
                </p>
                {attendance.subjects?.map((s, i) => (
                  <p key={i} className="mb-1">
                    {s.name}:{" "}
                    <span className={getAttendanceClass(s.percentage)}>
                      {s.percentage}%
                    </span>
                  </p>
                ))}
              </div>
            )}

            {activeTab === "courses" && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Courses</h2>
                {courses.map((c, i) => (
                  <div key={i} className="border-b pb-2 mb-2">
                    <p>
                      <b>{c.name}</b> ({c.code})
                    </p>
                    <p>Instructor: {c.instructor}</p>
                    <p>
                      Status: {c.status} | Progress: {c.progress}%
                    </p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "results" && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Results</h2>
                {results.map((r, i) => (
                  <div key={i} className="mb-3">
                    <p>
                      <b>{r.semester}</b> - GPA: {r.gpa}
                    </p>
                    {r.subjects.map((sub, j) => (
                      <p key={j}>
                        {sub.name}:{" "}
                        <span className={getGradeClass(sub.grade)}>
                          {sub.grade}
                        </span>
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {activeTab === "achievements" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                  My Achievements
                </h2>

                {achievements.length > 0 ? (
                  <div className="space-y-4">
                    {achievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className="w-full rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
                      >
                        {/* Title + Category */}
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-semibold text-lg text-gray-900">
                            {achievement.title}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                              achievement.category
                            )}`}
                          >
                            {achievement.category}
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-gray-700 text-sm mb-3">
                          {achievement.description}
                        </p>

                        {/* Status + Approver + Date */}
                        <div className="flex flex-wrap gap-3 items-center text-xs text-gray-500 mb-3">
                          <span
                            className={`px-2.5 py-1 rounded-full font-semibold ${
                              achievement.status === "approved"
                                ? "bg-green-100 text-green-700"
                                : achievement.status === "rejected"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {achievement.status
                              ? achievement.status.charAt(0).toUpperCase() +
                                achievement.status.slice(1)
                              : "Pending"}
                          </span>

                          {achievement.approver?.fullName && (
                            <span>
                              {achievement.status === "approved"
                                ? "Approved by "
                                : achievement.status === "rejected"
                                ? "Rejected by "
                                : ""}
                              <span className="font-medium">
                                {achievement.approver.fullName}
                              </span>
                            </span>
                          )}

                          <span>
                            {achievement.updatedAt
                              ? formatDate(achievement.updatedAt)
                              : achievement.date
                              ? formatDate(achievement.date)
                              : ""}
                          </span>
                        </div>

                        {/* Proof */}
                        {achievement.proof && (
                          <div className="mt-2">
                            <span className="font-medium text-gray-800">
                              Proof:{" "}
                            </span>
                            {achievement.proof.startsWith("http") ? (
                              <a
                                href={achievement.proof}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-teal-600 underline break-all hover:text-teal-800"
                              >
                                View Proof
                              </a>
                            ) : (
                              <span className="text-gray-500">
                                {achievement.proof}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Award
                      size={56}
                      className="mx-auto mb-4 opacity-40 text-gray-400"
                    />
                    <p className="text-lg font-medium">
                      No achievements found.
                    </p>
                    <p className="text-sm">
                      Your achievements will appear here once you add them.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
