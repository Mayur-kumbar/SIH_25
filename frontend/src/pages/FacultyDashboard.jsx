import React, { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';

import { 
  CheckCircle, 
  XCircle, 
  Eye, 
  Download, 
  Filter, 
  Search, 
  Users, 
  Award, 
  Clock, 
  FileText, 
  BarChart3, 
  Home,
  Settings,
  Bell,
  Calendar,
  AlertCircle,
  MessageSquare,
  User,
  GraduationCap,
  TrendingUp,
  X
} from 'lucide-react';

// Mock pending achievements data
const mockPendingAchievements = [
  {
    id: 1,
    studentName: "Alex Johnson",
    studentId: "CS2021001",
    semester: 6,
    title: "Hackathon Participation",
    category: "Competition",
    description: "Participated in the 48-hour Smart City hackathon and developed a traffic management solution that won 2nd place",
    date: "2024-01-20",
    submittedDate: "2024-01-25",
    evidence: "hackathon_certificate.pdf",
    status: "pending",
    points: 30
  },
  {
    id: 2,
    studentName: "Sarah Miller",
    studentId: "CS2021045",
    semester: 4,
    title: "Research Publication",
    category: "Academic",
    description: "Co-authored research paper on Machine Learning applications in Healthcare published in IEEE conference",
    date: "2024-02-15",
    submittedDate: "2024-02-20",
    evidence: "research_paper.pdf",
    status: "pending",
    points: 50
  },
  {
    id: 3,
    studentName: "Mike Chen",
    studentId: "CS2021023",
    semester: 8,
    title: "Open Source Contribution",
    category: "Technical",
    description: "Contributed 15+ pull requests to popular React library with 10k+ GitHub stars",
    date: "2024-01-10",
    submittedDate: "2024-01-15",
    evidence: "github_contributions.pdf",
    status: "pending",
    points: 35
  }
];

// Mock students data
const mockStudents = [
  {
    id: 1,
    name: "Alex Johnson",
    studentId: "CS2021001",
    semester: 6,
    totalAchievements: 3,
    approvedAchievements: 2,
    totalPoints: 90,
    lastActivity: "2024-01-25"
  },
  {
    id: 2,
    name: "Sarah Miller",
    studentId: "CS2021045",
    semester: 4,
    totalAchievements: 2,
    approvedAchievements: 1,
    totalPoints: 45,
    lastActivity: "2024-02-20"
  },
  {
    id: 3,
    name: "Mike Chen",
    studentId: "CS2021023",
    semester: 8,
    totalAchievements: 4,
    approvedAchievements: 3,
    totalPoints: 120,
    lastActivity: "2024-01-15"
  }
];

export default function FacultyDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [pendingAchievements, setPendingAchievements] = useState([]);
  const [processedAchievements, setProcessedAchievements] = useState([]);
  const [students] = useState(mockStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [feedback, setFeedback] = useState('');

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
      // Map backend data to your frontend structure if needed
      setPendingAchievements(
        response.data.map((act) => ({
          id: act._id,
          studentName: act.student?.fullName,
          studentId: act.student?._id,
          title: act.title,
          category: act.category,
          description: act.description,
          date: act.createdAt,
          status: act.status,
          // Add other fields as needed
        }))
      );

      console.log("Fetched pending activities:", response.data);
    } catch (err) {
      console.error("Error fetching pending activities:", err);
    }
  };

  useEffect(() => {
    getProfile();
    getPendingActivities();
  }, []);

  // Handle approval/rejection
  const handleApproval = (achievementId, action, feedbackText = '') => {
    const achievement = pendingAchievements.find(a => a.id === achievementId);
    if (!achievement) return;

    const processedAchievement = {
      ...achievement,
      status: action,
      processedDate: new Date().toISOString().split('T')[0],
      feedback: feedbackText,
      points: action === 'approved' ? achievement.points : 0
    };

    // Remove from pending
    setPendingAchievements(prev => prev.filter(a => a.id !== achievementId));
    
    // Add to processed
    setProcessedAchievements(prev => [processedAchievement, ...prev]);

    // Close modal
    setShowModal(false);
    setSelectedAchievement(null);
    setFeedback('');

    // In real app, make API call here
    console.log(`Achievement ${achievementId} ${action}`, { feedback: feedbackText });
  };

  const openApprovalModal = (achievement) => {
    setSelectedAchievement(achievement);
    setShowModal(true);
  };

  // Computed stats
  const stats = {
    pendingReviews: pendingAchievements.length,
    approvedToday: processedAchievements.filter(a => 
      a.status === 'approved' && a.processedDate === new Date().toISOString().split('T')[0]
    ).length,
    totalStudents: students.length,
    avgPoints: Math.round(students.reduce((sum, s) => sum + s.totalPoints, 0) / students.length)
  };

  // Filter achievements
  const filteredPending = pendingAchievements.filter(achievement => {
    const matchesSearch = achievement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         achievement.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         achievement.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || achievement.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredProcessed = processedAchievements.filter(achievement => {
    const matchesSearch = achievement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         achievement.studentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || achievement.status === filterStatus;
    return matchesSearch && matchesStatus;
  });
  
  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.fullName}!</h1>
          <p className="text-gray-600 mt-1">Review student achievements and manage approvals</p>
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
              <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
              <p className="text-2xl font-bold text-orange-600">{stats.pendingReviews}</p>
            </div>
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved Today</p>
              <p className="text-2xl font-bold text-green-600">{stats.approvedToday}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalStudents}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Points</p>
              <p className="text-2xl font-bold text-purple-600">{stats.avgPoints}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Recent Pending Achievements */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Recent Pending Reviews</h2>
            <button 
              onClick={() => setActiveTab('approvals')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View All
            </button>
          </div>
        </div>
        <div className="p-6">
          {pendingAchievements.slice(0, 3).map(achievement => (
            <div key={achievement._id} className="flex items-center justify-between p-4 border rounded-lg mb-4 last:mb-0 hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Award size={20} className="text-orange-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{achievement.title}</h3>
                  <p className="text-sm text-gray-500">
                    {achievement.studentName} • {achievement.category} • {achievement.date
                            ? new Date(
                                achievement.date
                              ).toLocaleDateString()
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
          <h1 className="text-2xl font-bold text-gray-900">Achievement Approvals</h1>
          <p className="text-gray-600 mt-1">Review and approve student achievements</p>
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
          <option value="Academic">Academic</option>
          <option value="Competition">Competition</option>
          <option value="Technical">Technical</option>
          <option value="Certification">Certification</option>
          <option value="Sports">Sports</option>
          <option value="Cultural">Cultural</option>
        </select>
      </div>

      {/* Pending Achievements */}
      <div className="space-y-4">
        {filteredPending.map(achievement => (
          <div key={achievement.id} className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{achievement.title}</h3>
                  <span className="px-3 py-1 bg-blue-100 text-blue-600 text-sm font-medium rounded-full">
                    {achievement.category}
                  </span>
                  <span className="px-3 py-1 bg-orange-100 text-orange-600 text-sm font-medium rounded-full">
                    {achievement.points} points
                  </span>
                </div>
                
                <div className="mb-3">
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Student:</span> {achievement.studentName} ({achievement.studentId}) - Semester {achievement.semester}
                  </p>
                  <p className="text-gray-700">{achievement.description}</p>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Calendar size={14} className="mr-1" />
                    Achievement Date: {achievement.date}
                  </span>
                  <span className="flex items-center">
                    <Clock size={14} className="mr-1" />
                    Submitted: {achievement.submittedDate}
                  </span>
                  {achievement.evidence && (
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
                onClick={() => handleApproval(achievement.id, 'approved', 'Good achievement!')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <CheckCircle size={16} className="mr-2" />
                Quick Approve
              </button>
              <button 
                onClick={() => handleApproval(achievement.id, 'rejected', 'Needs more evidence')}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
              >
                <XCircle size={16} className="mr-2" />
                Quick Reject
              </button>
              {achievement.evidence && (
                <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                  <Download size={16} className="mr-2" />
                  Download Evidence
                </button>
              )}
            </div>
          </div>
        ))}

        {filteredPending.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-green-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
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
          <p className="text-gray-600 mt-1">Previously approved and rejected achievements</p>
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
        {filteredProcessed.map(achievement => (
          <div key={achievement.id} className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{achievement.title}</h3>
                  <span className="px-3 py-1 bg-blue-100 text-blue-600 text-sm font-medium rounded-full">
                    {achievement.category}
                  </span>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                    achievement.status === 'approved' 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {achievement.status}
                  </span>
                  {achievement.points > 0 && (
                    <span className="px-3 py-1 bg-purple-100 text-purple-600 text-sm font-medium rounded-full">
                      {achievement.points} points
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Student:</span> {achievement.studentName} ({achievement.studentId})
                </p>
                
                <p className="text-sm text-gray-500 mb-2">
                  Processed on: {achievement.processedDate}
                </p>
                
                {achievement.feedback && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-1">Feedback:</p>
                    <p className="text-sm text-gray-600">{achievement.feedback}</p>
                  </div>
                )}
              </div>
              
              <div className="flex items-center ml-4">
                {achievement.status === 'approved' ? (
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

  const renderStudents = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Students</h1>
        <p className="text-gray-600 mt-1">Overview of students and their achievements</p>
      </div>

      <div className="grid gap-6">
        {students.map(student => (
          <div key={student.id} className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User size={24} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
                  <p className="text-sm text-gray-500">
                    {student.studentId} • Semester {student.semester}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <p className="text-lg font-bold text-blue-600">{student.totalAchievements}</p>
                  <p className="text-xs text-gray-500">Total</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-green-600">{student.approvedAchievements}</p>
                  <p className="text-xs text-gray-500">Approved</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-purple-600">{student.totalPoints}</p>
                  <p className="text-xs text-gray-500">Points</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                Last activity: {student.lastActivity}
              </p>
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Approval Statistics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Reviewed</span>
              <span className="font-bold">{processedAchievements.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Approved</span>
              <span className="font-bold text-green-600">
                {processedAchievements.filter(a => a.status === 'approved').length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Rejected</span>
              <span className="font-bold text-red-600">
                {processedAchievements.filter(a => a.status === 'rejected').length}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Performance</h3>
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
      case 'dashboard': return renderDashboard();
      case 'approvals': return renderApprovals();
      case 'history': return renderHistory();
      case 'students': return renderStudents();
      case 'analytics': return renderAnalytics();
      default: return renderDashboard();
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
                <span className="text-xl font-semibold text-gray-900">Faculty Portal</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
              </div>
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {user?.fullName?.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
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
                { name: 'Dashboard', tab: 'dashboard', icon: Home },
                { name: 'Pending Approvals', tab: 'approvals', icon: Clock, badge: stats.pendingReviews },
                { name: 'Review History', tab: 'history', icon: CheckCircle },
                { name: 'My Students', tab: 'students', icon: Users },
                { name: 'Analytics', tab: 'analytics', icon: BarChart3 }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.name}
                    onClick={() => setActiveTab(item.tab)}
                    className={`w-full flex items-center justify-between px-4 py-3 text-left rounded-lg transition-colors ${
                      activeTab === item.tab 
                        ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' 
                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
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
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Modal for detailed review */}
      {showModal && selectedAchievement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Review Achievement</h2>
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
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{selectedAchievement.title}</h3>
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
                    <label className="text-sm font-medium text-gray-600">Student Name</label>
                    <p className="text-gray-900">{selectedAchievement.studentName || selectedAchievement.student?.fullName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Student ID</label>
                    <p className="text-gray-900">{selectedAchievement.studentId || selectedAchievement.student?._id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Semester</label>
                    <p className="text-gray-900">{selectedAchievement.semester || selectedAchievement.student?.semester}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Achievement Date</label>
                    <p className="text-gray-900">{selectedAchievement.date ? new Date(selectedAchievement.date).toLocaleDateString() : ""}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2 block">
                    Proof
                  </label>
                  {selectedAchievement.evidence ? (
                    <div className="bg-gray-50 rounded-lg p-4">
                      {selectedAchievement.evidence.endsWith(".pdf") ? (
                        <a
                          href={selectedAchievement.evidence}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                          </svg>
                          <span>View PDF</span>
                        </a>
                      ) : (
                        <div className="border-2 border-dashed border-gray-200 rounded-lg p-2 bg-white">
                          <img
                            src={selectedAchievement.evidence}
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
                  <label className="text-sm font-medium text-gray-600">Description</label>
                  <p className="text-gray-900 mt-1">{selectedAchievement.description}</p>
                </div>

                {selectedAchievement.evidence && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Evidence</label>
                    <div className="mt-1 flex items-center space-x-2">
                      <FileText size={16} className="text-gray-400" />
                      <span className="text-blue-600 hover:text-blue-700 cursor-pointer">
                        {selectedAchievement.evidence}
                      </span>
                      <button className="text-blue-600 hover:text-blue-700">
                        <Download size={16} />
                      </button>
                    </div>
                  </div>
                )}

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
                onClick={() => handleApproval(selectedAchievement.id || selectedAchievement._id, 'rejected', feedback)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
              >
                <XCircle size={16} className="mr-2" />
                Reject
              </button>
              <button 
                onClick={() => handleApproval(selectedAchievement.id || selectedAchievement._id, 'approved', feedback)}
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