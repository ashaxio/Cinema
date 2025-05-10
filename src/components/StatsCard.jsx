import React from 'react';

const colorClasses = {
  blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  amber: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  red: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
};

const StatsCard = ({ title, value, icon, color }) => {
  return (
    <div className="bg-[#0f1827] dark:bg-slate-800 rounded-lg shadow p-6 transition-all duration-300 hover:shadow-md">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          {icon}
        </div>
        <div className="ml-5">
          <p className="text-sm font-medium text-white-500 dark:text-gray-400">{title}</p>
          <p className="mt-1 text-xl font-semibold text-white-900 dark:text-white">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;