import React from "react";
import { X, Calendar, Award, User, CheckCircle, Clock, AlertCircle } from "lucide-react";

export default function ViewDetails({ open, onClose, achievement }) {
  if (!open || !achievement) return null;

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'pending':
        return <Clock size={16} className="text-yellow-500" />;
      case 'rejected':
        return <AlertCircle size={16} className="text-red-500" />;
      default:
        return <Clock size={16} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'text-green-700 bg-green-100';
      case 'pending':
        return 'text-yellow-700 bg-yellow-100';
      case 'rejected':
        return 'text-red-700 bg-red-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden relative transform transition-all">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-5 border-b border-gray-100">
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-white hover:bg-opacity-50 rounded-full p-1.5 transition-all duration-200"
            onClick={onClose}
          >
            <X size={20} />
          </button>
          <div className="flex items-center space-x-3">
            <div className="bg-blue-500 p-2 rounded-lg">
              <Award size={20} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Achievement Details
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-6">
            {/* Title */}
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2 block">
                Title
              </label>
              <h3 className="text-lg font-semibold text-gray-900 leading-relaxed">
                {achievement.title}
              </h3>
            </div>

            {/* Category and Status Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2 block">
                  Category
                </label>
                <div className="bg-blue-50 text-blue-800 px-3 py-2 rounded-lg font-medium text-sm">
                  {achievement.category}
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2 block">
                  Status
                </label>
                <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium text-sm ${getStatusColor(achievement.status)}`}>
                  {getStatusIcon(achievement.status)}
                  <span>{achievement.status}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2 block">
                Description
              </label>
              <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                {achievement.description}
              </p>
            </div>

            {/* Date */}
            <div>
              <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2 block">
                Date
              </label>
              <div className="flex items-center space-x-2 text-gray-700 bg-gray-50 p-3 rounded-lg">
                <Calendar size={16} className="text-gray-500" />
                <span className="font-medium">
                  {achievement.updatedAt
                    ? new Date(achievement.updatedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : "Date not available"}
                </span>
              </div>
            </div>

            {/* Approver */}
            {achievement.approver && (
              <div>
                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2 block">
                  Approver
                </label>
                <div className="flex items-center space-x-2 text-gray-700 bg-gray-50 p-3 rounded-lg">
                  <User size={16} className="text-gray-500" />
                  <span className="font-medium">{achievement.approver}</span>
                </div>
              </div>
            )}

            {/* Proof */}
            <div>
              <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2 block">
                Proof
              </label>
              {achievement.proofUrl ? (
                <div className="bg-gray-50 rounded-lg p-4">
                  {achievement.proofUrl.endsWith(".pdf") ? (
                    <a
                      href={achievement.proofUrl}
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
                        src={achievement.proofUrl}
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
          </div>
        </div>
      </div>
    </div>
  );
}