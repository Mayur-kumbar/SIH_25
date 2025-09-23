import React, { useState } from 'react';
import { Upload, Eye, List, Plus, Bell, User, Home, BarChart3, Settings, Award, Calendar, Users, FileText } from 'lucide-react';

export default function SmartStudentHub() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const stats = [
    { label: 'Total Achievements', value: '3', sublabel: 'All live achievements', color: 'bg-blue-50' },
    { label: 'Approved', value: '2', sublabel: 'Verified achievements', color: 'bg-green-50' },
    { label: 'Pending Approval', value: '1', sublabel: 'Waiting faculty review', color: 'bg-yellow-50' },
    { label: 'Portfolio Score', value: '85%', sublabel: 'Current rating', trend: '+5%', color: 'bg-purple-50' }
  ];

  const achievements = [
    {
      id: 1,
      title: 'Best Project Award',
      description: 'Won first place in the annual project competition for developing an AI-powered study assistant',
      date: '3/15/2024',
      status: 'Approved',
      approver: 'Dr. Emily Rodriguez on 3/20/2024',
      statusColor: 'text-green-600 bg-green-100'
    },
    {
      id: 2,
      title: 'AWS Cloud Practitioner Certification',
      description: 'Successfully completed AWS Cloud Practitioner certification with a score of 95%',
      date: '2/10/2024',
      status: 'Approved',
      approver: 'Prof. Michael Thompson on 2/15/2024',
      statusColor: 'text-green-600 bg-green-100'
    },
    {
      id: 3,
      title: 'Hackathon Participation',
      description: 'Participated in the 48-hour Smart City hackathon and developed a traffic management solution',
      date: '1/20/2024',
      status: 'Pending',
      approver: '',
      statusColor: 'text-yellow-600 bg-yellow-100'
    }
  ];

  const upcomingDeadlines = [
    { title: 'Portfolio Review', date: 'Tomorrow', type: 'Review' },
    { title: 'NAAC Documentation', date: '5 days', type: 'Submission' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <span className="text-xl font-semibold text-gray-900">Smart Student Hub</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-gray-700">
                <Home size={20} />
                <span className="ml-1 text-sm">Dashboard</span>
              </button>
              <button className="text-gray-500 hover:text-gray-700">
                <Upload size={20} />
                <span className="ml-1 text-sm">Upload Achievement</span>
              </button>
              <button className="text-gray-500 hover:text-gray-700">
                <Eye size={20} />
                <span className="ml-1 text-sm">My Portfolio</span>
              </button>
              <button className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
                Login
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, Alex!</h1>
          <p className="text-gray-600">Track your achievements and build your academic portfolio</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className={`${stat.color} p-6 rounded-xl border`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-xs text-gray-500 mt-1">{stat.sublabel}</p>
                      {stat.trend && (
                        <p className="text-xs text-green-600 mt-1">{stat.trend} from last month</p>
                      )}
                    </div>
                    <div className="w-8 h-8 bg-white bg-opacity-50 rounded-lg flex items-center justify-center">
                      {index === 0 && <Award size={16} className="text-blue-600" />}
                      {index === 1 && <FileText size={16} className="text-green-600" />}
                      {index === 2 && <Calendar size={16} className="text-yellow-600" />}
                      {index === 3 && <BarChart3 size={16} className="text-purple-600" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Achievements */}
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Achievements</h2>
                  <button className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center">
                    <Plus size={16} className="mr-2" />
                    Add Achievement
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                          <Award size={16} className="text-teal-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{achievement.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${achievement.statusColor}`}>
                        {achievement.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span className="flex items-center">
                        <Calendar size={14} className="mr-1" />
                        {achievement.date}
                      </span>
                      {achievement.approver && (
                        <span>Approved by {achievement.approver}</span>
                      )}
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <button className="bg-orange-500 text-white px-3 py-1 rounded text-xs font-medium">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
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
                <button className="w-full flex items-center px-4 py-3 bg-teal-50 text-teal-700 rounded-lg hover:bg-teal-100 transition-colors">
                  <Upload size={16} className="mr-3" />
                  Upload New Achievement
                </button>
                <button className="w-full flex items-center px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                  <Eye size={16} className="mr-3" />
                  View Portfolio
                </button>
                <button className="w-full flex items-center px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                  <List size={16} className="mr-3" />
                  All Achievements
                </button>
              </div>
            </div>

            {/* Student Information */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Roll Number</p>
                  <p className="text-sm text-gray-900">N/A</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Department</p>
                  <p className="text-sm text-gray-900">Computer Science</p>
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
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{deadline.title}</p>
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
    </div>
  );
}