import React from "react";
import {
  FileText,
  Users,
  Star,
  Percent,
  Upload,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";

const StatCard = ({ icon, title, value, color }) => (
  <motion.div
    className="bg-white p-6 rounded-xl shadow-lg flex items-center gap-6 border-l-4"
    style={{ borderColor: color }}
    whileHover={{ scale: 1.05 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <div className="p-3 rounded-full" style={{ backgroundColor: `${color}20` }}>
      {React.cloneElement(icon, { color, size: 32 })}
    </div>
    <div>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </motion.div>
);

const RecentActivityItem = ({ name, role, score, time }) => (
  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-3 hover:bg-gray-100 transition">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
        <FileText className="text-gray-500" />
      </div>
      <div>
        <p className="font-semibold text-gray-800">{name}</p>
        <p className="text-sm text-gray-600">{role}</p>
      </div>
    </div>
    <div className="text-right">
      <p className="font-bold text-blue-600">{score}% Match</p>
      <p className="text-xs text-gray-400">{time}</p>
    </div>
  </div>
);

const DashboardContent = () => {
  const stats = [
    {
      icon: <FileText />,
      title: "Resumes Analyzed",
      value: "152",
      color: "#3b82f6",
    },
    {
      icon: <Users />,
      title: "Top Candidates",
      value: "18",
      color: "#10b981",
    },
    {
      icon: <Star />,
      title: "Avg. Match Score",
      value: "82%",
      color: "#f59e0b",
    },
    {
      icon: <Percent />,
      title: "Success Rate",
      value: "95%",
      color: "#ef4444",
    },
  ];

  const recentActivities = [
    {
      name: "John Doe",
      role: "Frontend Developer",
      score: 92,
      time: "2 hours ago",
    },
    {
      name: "Jane Smith",
      role: "Backend Developer",
      score: 88,
      time: "5 hours ago",
    },
    {
      name: "Peter Jones",
      role: "UI/UX Designer",
      score: 85,
      time: "1 day ago",
    },
    {
      name: "Mary Johnson",
      role: "Full Stack Developer",
      score: 95,
      time: "2 days ago",
    },
  ];

  return (
    <motion.div
      className="p-8 bg-gray-50 min-h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Welcome Back!</h1>
          <p className="text-gray-500">
            Here's what's happening with your candidates today.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Recent Activity</h2>
          <a
            href="#"
            className="text-blue-600 font-semibold flex items-center gap-1 hover:underline"
          >
            <span>View All</span>
            <ArrowRight size={16} />
          </a>
        </div>
        <div>
          {recentActivities.map((activity, index) => (
            <RecentActivityItem key={index} {...activity} />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardContent;
