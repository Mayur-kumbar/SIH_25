import React from "react";

const AchievementCard = ({ achievement }) => {
  return (
    <div className="p-4 border rounded-lg shadow bg-white">
      <h4 className="text-lg font-semibold text-gray-800">{achievement.title}</h4>
      <p className="text-sm text-gray-600">{achievement.description}</p>
      <p className="text-xs text-gray-500 mt-2">
        📅 {achievement.date}
      </p>
      <p className="text-xs text-green-600 mt-1">
        {achievement.status}
      </p>
    </div>
  );
};

export default AchievementCard;
