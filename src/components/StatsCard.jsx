import { useTheme } from "./ThemeContext";

const colorClasses = {
  blue: {
    cardBg: "bg-blue-300",
    darkCardBg: "dark:bg-blue-900/30 dark:bg-opacity-30",
    text: "text-blue-600 dark:text-blue-600",
  },
  green: {
    cardBg: "bg-green-300",
    darkCardBg: "dark:bg-green-900/30 dark:bg-opacity-30",
    text: "text-green-600 dark:text-green-600",
  },
  purple: {
    cardBg: "bg-purple-300",
    darkCardBg: "dark:bg-purple-900/30 dark:bg-opacity-30",
    text: "text-purple-600 dark:text-purple-600",
  },
  amber: {
    cardBg: "bg-amber-300",
    darkCardBg: "dark:bg-amber-900/30 dark:bg-opacity-30",
    text: "text-amber-600 dark:text-amber-600",
  },
  red: {
    cardBg: "bg-red-300",
    darkCardBg: "dark:bg-red-900/30 dark:bg-opacity-30",
    text: "text-red-600 dark:text-red-600",
  },
};

const StatsCard = ({ title, value, icon, color }) => {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`rounded-lg shadow p-6 transition-all duration-300 hover:shadow-md ${
        colorClasses[color].cardBg
      } ${isDarkMode ? colorClasses[color].darkCardBg : ""}`}
    >
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${colorClasses[color].text}`}>
          {icon}
        </div>
        <div className="ml-5">
          <p className="text-sm font-medium text-white-500 dark:text-white-400">
            {title}
          </p>
          <p className="mt-1 text-xl font-semibold">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
