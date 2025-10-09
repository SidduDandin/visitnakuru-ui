"use client"; // needed if it uses props dynamically

import React from "react";

type WidgetProps = {
  title: string;
  count?: number;
  icon?: React.ReactNode; // optional icon
  bgColor?: string; // optional bg color
};

const Widget: React.FC<WidgetProps> = ({ title, count, icon, bgColor }) => {
  return (
    <div
      className={`flex items-center justify-between rounded-lg p-4 shadow-md ${
        bgColor || "bg-white"
      }`}
    >
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        {count !== undefined && <p className="text-2xl font-bold">{count}</p>}
      </div>
      {icon && <div className="text-3xl">{icon}</div>}
    </div>
  );
};

export default Widget;
