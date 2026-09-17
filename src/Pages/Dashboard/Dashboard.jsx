import React from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  AlertTriangle,
  Camera,
  TrendingUp,
  ShieldCheck,
  Clock,
  Activity,
  CameraOff
} from "lucide-react";
import newRequest from "../../utils/userRequest";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@heroui/react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate()


  const getHealth = async () => {
    const res = await newRequest.get("/health");
    return res.data;
  };

  const {
    data: healthData,
    isLoading: healthLoading,
  } = useQuery({
    queryKey: ["health"],
    queryFn: getHealth,
  });

  const cameras = healthData?.cameras
    ? Object.entries(healthData.cameras).map(([key, camera], index) => ({
      id: index + 1,
      key,
      name: camera.name,
      // imagecamera: `${baseUrl}${camera.endpoint}`,
      location: camera.location,
      status:
        healthData.stream_running && camera.has_frame ? "online" : "offline",
      lastUpdate: "Live",
      ipaddress: camera.cameraIP,
      hasFrame: camera.has_frame,
    }))
    : [];

  const getAlerts = async () => {
    const res = await newRequest.get("/detection-alerts");
    return res.data.data;
  };

  const { data: RecentAlerts = [], isLoading: alertLoading } = useQuery({
    queryKey: ["alerts"],
    queryFn: getAlerts,
  });

  const totalAlerts = RecentAlerts.length;


  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const todayIncidents = RecentAlerts.filter((alert) =>
    isSameDay(new Date(alert.time), today),
  ).length;

  const yesterdayIncidents = RecentAlerts.filter((alert) =>
    isSameDay(new Date(alert.time), yesterday),
  ).length;

  // Difference
  const incidentDifference = todayIncidents - yesterdayIncidents;

  // Percentage change
  const incidentPercentage =
    yesterdayIncidents === 0
      ? todayIncidents > 0
        ? 100
        : 0
      : Math.round((incidentDifference / yesterdayIncidents) * 100);

  // Status
  const incidentTrend =
    incidentDifference > 0 ? "up" : incidentDifference < 0 ? "down" : "same";

  const stats = [
    {
      title: "Total Cameras",
      value: `${cameras.length || "0"}`,
      loading: healthLoading,
      change: "+2",
      changeType: "positive",
      icon: Camera,
      color: "blue",
      description: "Active monitoring devices",
    },
    {
      title: "Active Alerts",
      value: `${totalAlerts}`,
      loading: alertLoading,
      change: "+5",
      changeType: "negative",
      icon: AlertTriangle,
      color: "red",
      description: "Requires attention",
    },
    {
      title: "Workers On-Site",
      value: "156",
      change: "+12",
      changeType: "positive",
      icon: Users,
      color: "green",
      description: "Currently active",
    },
    {
      title: "Safety Score",
      value: "94%",
      change: "+3%",
      changeType: "positive",
      icon: ShieldCheck,
      color: "purple",
      description: "Overall compliance",
    },
  ];

  const recentActivity = [
    {
      id: 1,
      type: "alert",
      message: "No helmet detected in Production Area 1",
      time: "2 min ago",
      severity: "high"
    },
    {
      id: 2,
      type: "info",
      message: "Camera 3 came back online",
      time: "5 min ago",
      severity: "low"
    },
    {
      id: 3,
      type: "alert",
      message: "Unauthorized access attempt at Gate 2",
      time: "12 min ago",
      severity: "high"
    },
    {
      id: 4,
      type: "success",
      message: "Safety inspection completed - Zone A",
      time: "25 min ago",
      severity: "low"
    }
  ];

  const cameraStatus = [
    { name: "Camera 1", status: "online", location: "Production Area 1" },
    { name: "Camera 2", status: "online", location: "Production Area 2" },
    { name: "Camera 3", status: "offline", location: "Warehouse" },
    { name: "Camera 4", status: "online", location: "Loading Dock" },
    { name: "Camera 5", status: "online", location: "Main Entrance" }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: "bg-blue-50",
        iconBg: "bg-blue-500",
        text: "text-blue-600"
      },
      red: {
        bg: "bg-red-50",
        iconBg: "bg-red-500",
        text: "text-red-600"
      },
      green: {
        bg: "bg-green-50",
        iconBg: "bg-green-500",
        text: "text-green-600"
      },
      purple: {
        bg: "bg-purple-50",
        iconBg: "bg-purple-500",
        text: "text-purple-600"
      }
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="flex min-h-screen bg-linear-to-br from-slate-50 to-slate-100 w-full">
      <div className="flex-1 p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Dashboard</h1>
          <p className="text-slate-500">
            Real-time monitoring and safety overview
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const colors = getColorClasses(stat.color);
            return (
              <motion.div
                key={index}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`${colors.bg} p-3 rounded-xl`}>
                    <Icon className={`w-6 h-6 ${colors.text}`} />
                  </div>
                  <span
                    className={`text-sm font-medium ${stat.changeType === "positive"
                        ? "text-green-600"
                        : "text-red-600"
                      }`}
                  >
                    {stat.change}
                  </span>
                </div>

                {stat.loading ? (
                  <div className="mt-3">
                    <Spinner size="sm" />
                  </div>
                ) : (
                  <h3 className="text-2xl font-bold text-slate-800 mb-1">
                    {stat.value}
                  </h3>
                )}
                <p className="text-slate-500 text-sm font-medium">
                  {stat.title}
                </p>
                <p className="text-slate-400 text-xs mt-1">
                  {stat.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Main Content Grid */}
        {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6"> */}
        {/* Recent Activity */}
        {/* <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800">
                Recent Activity
              </h2>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                View All →
              </button>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <div
                    className={`p-2 rounded-lg ${
                      activity.severity === "high"
                        ? "bg-red-100"
                        : activity.type === "success"
                          ? "bg-green-100"
                          : "bg-blue-100"
                    }`}
                  >
                    {activity.type === "alert" && (
                      <AlertTriangle
                        className={`w-5 h-5 ${
                          activity.severity === "high"
                            ? "text-red-600"
                            : "text-blue-600"
                        }`}
                      />
                    )}
                    {activity.type === "info" && (
                      <Camera className="w-5 h-5 text-blue-600" />
                    )}
                    {activity.type === "success" && (
                      <ShieldCheck className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-700 font-medium">
                      {activity.message}
                    </p>
                    <p className="text-slate-400 text-sm mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div> */}

        {/* Camera Status */}
        {/* <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800">
                Camera Status
              </h2>
              <Activity className="w-5 h-5 text-slate-400" />
            </div>

            {healthLoading ? (
              <div className="flex items-center justify-center py-12">
                <Spinner size="lg" color="primary" />
              </div>
            ) : cameras.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                <CameraOff className="w-12 h-12 mb-3 text-slate-400" />
                <p className="font-medium">No cameras found</p>
                <p className="text-sm text-slate-400">
                  No camera data is available.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {cameras.map((camera, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          camera.status === "online"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      />
                      <div>
                        <p className="text-slate-700 font-medium text-sm">
                          {camera.name}
                        </p>
                        <p className="text-slate-400 text-xs">
                          {camera.location}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        camera.status === "online"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {camera.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div> */}
        {healthLoading ? (
          // <div className="flex items-center justify-center py-12">
          //   <Spinner size="lg" color="primary" />
          // </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-slate-50 rounded-2xl p-5 shadow"
              >
                {/* Icon + Status */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-200 animate-pulse" />
                  <div className="w-16 h-6 rounded-full bg-slate-200 animate-pulse" />
                </div>

                {/* Camera Name */}
                <div className="h-6 w-32 bg-slate-200 rounded animate-pulse mb-2" />

                {/* Location */}
                <div className="h-4 w-24 bg-slate-200 rounded animate-pulse mb-4" />

                {/* Divider */}
                <div className="border-t pt-3 space-y-3">
                  <div className="h-4 w-full bg-slate-200 rounded animate-pulse" />
                  <div className="h-4 w-5/6 bg-slate-200 rounded animate-pulse" />
                  <div className="h-4 w-2/3 bg-slate-200 rounded animate-pulse" />
                </div>
              </motion.div>
            ))}
          </div>
        ) : cameras.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500">
            <CameraOff className="w-12 h-12 mb-3 text-slate-400" />
            <p className="font-medium">No cameras found</p>
            <p className="text-sm text-slate-400">
              No camera data is available.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cameras.map((camera) => (
              <motion.div
                key={camera.id}
                whileHover={{ y: -4 }}
                className="bg-white hover:bg-slate-50 rounded-2xl shadow-lg p-5 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-3 rounded-xl ${camera.status === "online" ? "bg-green-100" : "bg-red-100"
                      }`}
                  >
                    <Camera
                      className={`w-6 h-6 ${camera.status === "online"
                          ? "text-green-600"
                          : "text-red-600"
                        }`}
                    />
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${camera.status === "online"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                      }`}
                  >
                    {camera.status.toUpperCase()}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-800">
                  {camera.name}
                </h3>

                <p className="text-sm text-slate-500 mt-1">{camera.location}</p>

                <div className="mt-4 border-t pt-3 space-y-1">
                  <p className="text-sm text-slate-600">
                    <span className="font-semibold">IP:</span>{" "}
                    {camera.ipaddress}
                  </p>

                  <p className="text-sm text-slate-600">
                    <span className="font-semibold">Last Update:</span>{" "}
                    {camera.lastUpdate}
                  </p>
                  <div className="flex items-center justify-between">

                  <p className="text-sm text-slate-600">
                    <span className="font-semibold">Frame:</span>{" "}
                    <span
                      className={`font-medium ${camera.hasFrame ? "text-green-600" : "text-red-600"
                        }`}
                    >
                      {camera.hasFrame ? "Available" : "No Frame"}
                    </span>
                  </p>
                  <p onClick={() =>
                    navigate(`/camera/${camera.id}`, {
                      state: {
                        ipAddress: camera.cameraIP,
                        cameraName: camera.name,
                        endpoint: camera.imagecamera,
                        location: camera.location
                      }
                    })
                  } className=" cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm">View</p>
                </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        {/* </div> */}

        {/* Quick Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6"
        >
          <div className="bg-linear-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium mb-1">
                  Today's Incidents
                </p>
                <p className="text-3xl font-bold">{todayIncidents}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-blue-200" />
            </div>
            <p className="text-blue-200 text-sm mt-3">
              {incidentTrend === "up" &&
                `↑ ${incidentPercentage}% from yesterday`}
              {incidentTrend === "down" &&
                `↓ ${Math.abs(incidentPercentage)}% from yesterday`}
              {incidentTrend === "same" && "No change from yesterday"}
            </p>
          </div>

          <div className="bg-linear-to-r from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium mb-1">
                  Compliance Rate
                </p>
                <p className="text-3xl font-bold">98.5%</p>
              </div>
              <ShieldCheck className="w-12 h-12 text-green-200" />
            </div>
            <p className="text-green-200 text-sm mt-3">↑ 2.3% this week</p>
          </div>

          <div className="bg-linear-to-r from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium mb-1">
                  Avg Response Time
                </p>
                <p className="text-3xl font-bold">2.4m</p>
              </div>
              <Clock className="w-12 h-12 text-purple-200" />
            </div>
            <p className="text-purple-200 text-sm mt-3">↓ 30s improvement</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Dashboard;
