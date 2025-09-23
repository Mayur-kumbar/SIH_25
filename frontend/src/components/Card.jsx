import React from "react";

const StatCard = ({ title, value, subtext }) => {
  return (
    <div className="p-4 border rounded-lg shadow bg-white">
      <h3 className="text-sm font-semibold text-gray-600">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {subtext && <p className="text-xs text-gray-500">{subtext}</p>}
    </div>
  );
};

export default StatCard;