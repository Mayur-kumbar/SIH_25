import React, { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import axios from "axios";
import ViewDetails from "../components/ViewDetails";
import Navbar from "../components/Navbar";
import AchievementUpload from "../components/AchievementUpload";

export default function AllAchievementsPage() {
  const [activities, setActivities] = useState([]);
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);

  const getStatusClass = (status) => {
    if (status === "approved") return "text-green-600 bg-green-100";
    if (status === "pending") return "text-yellow-600 bg-yellow-100";
    if (status === "rejected") return "text-red-600 bg-red-100";
    return "text-gray-600 bg-gray-100";
  };

  const fetchActivities = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get("/api/activity/my", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setActivities(response.data.activities);
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return (
    <>
      <Navbar setUploadOpen={setUploadOpen} />
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">All Achievements</h1>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <p className="text-gray-500 text-sm">No achievements found.</p>
          ) : (
            activities
              .slice()
              .reverse()
              .map((achievement) => (
                <div
                  key={achievement._id || achievement.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {achievement.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {achievement.description}
                      </p>
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
                        ? new Date(achievement.updatedAt).toLocaleDateString()
                        : ""}
                    </span>
                    {achievement.approver && (
                      <span>
                        {achievement.approver &&
                        achievement.status === "approved"
                          ? "Approved"
                          : "Rejected"}{" "}
                        by{" "}
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
                  {viewOpen && selectedAchievement && (
                    <ViewDetails
                      open={viewOpen}
                      onClose={() => setViewOpen(false)}
                      achievement={selectedAchievement}
                    />
                  )}
                </div>
              ))
          )}
        </div>
        <AchievementUpload
          open={uploadOpen}
          onClose={() => setUploadOpen(false)}
          onUpload={fetchActivities}
        />
      </div>
    </>
  );
}