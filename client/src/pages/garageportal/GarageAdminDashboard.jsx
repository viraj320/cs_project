import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FaChartBar,
  FaBuilding,
  FaUsers,
  FaTools,
  FaCalendarCheck,
  FaStar,
  FaUserCircle,
  FaSignOutAlt,
  FaHome,
  FaSync,
} from "react-icons/fa";
import axios from "axios";

const GarageAdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalGarages: 0,
    totalOwners: 0,
    totalBookings: 0, // This will be populated from the overview
    totalReviews: 0, // This will be populated from the overview
    recentBookings: [],
    recentReviews: [],
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");

    if (!token || userRole !== "garage_admin") {
      navigate("/login");
      return;
    }

    const userData = localStorage.getItem("userData");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);

  // Load admin overview stats
  const loadStats = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      // Fetch garages managed by admin
      const { data } = await axios.get("http://localhost:5000/api/garage-admin/dashboard-stats", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStats({
        totalGarages: data.totalGarages || 0,
        totalOwners: data.totalOwners || 0,
        totalBookings: data.totalBookings || 0,
        totalReviews: data.totalReviews || 0,
        recentBookings: data.recentBookings || [],
        recentReviews: data.recentReviews || [],
      });
    } catch (e) {
      console.error("Failed to load admin stats:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAccount = () => {
    navigate("/account");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userData");
    localStorage.removeItem("userRole");
    localStorage.removeItem("garageId");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-purple-900 to-purple-800 text-white p-5 space-y-5 shadow-lg overflow-y-auto">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Garage Admin</h1>
              <p className="text-xs text-purple-200">Management</p>
            </div>
            <button
              onClick={handleAccount}
              className="text-2xl hover:text-purple-300 transition"
              title="Account"
            >
              <FaUserCircle />
            </button>
          </div>

          {user && (
            <div className="bg-purple-700 p-3 rounded-lg border border-purple-600">
              <p className="text-xs text-purple-200">Admin User,</p>
              <p className="font-semibold text-white truncate">{user.name}</p>
              <p className="text-xs text-purple-300 truncate">{user.email}</p>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="border-b border-purple-700 pb-4 space-y-2">
          <h3 className="text-xs font-semibold text-purple-200 uppercase">Overview</h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-purple-700 p-2 rounded">
              <p className="text-purple-200">Garages</p>
              <p className="font-bold text-lg">{stats.totalGarages}</p>
            </div>
            <div className="bg-purple-700 p-2 rounded">
              <p className="text-purple-200">Owners</p>
              <p className="font-bold text-lg">{stats.totalOwners}</p>
            </div>
          </div>
          <button onClick={loadStats} className="w-full text-xs text-center text-purple-300 hover:text-white mt-2 flex items-center justify-center gap-1">
            <FaSync className={loading ? "animate-spin" : ""} /> {loading ? 'Loading...' : 'Refresh Stats'}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col space-y-2">
          <NavLink
            to="overview"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg transition ${
                isActive
                  ? "bg-purple-700 text-white"
                  : "text-purple-100 hover:bg-purple-700"
              }`
            }
          >
            <FaHome className="text-lg" /> Overview
          </NavLink>

          <NavLink
            to="garage-owners"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg transition ${
                isActive
                  ? "bg-purple-700 text-white"
                  : "text-purple-100 hover:bg-purple-700"
              }`
            }
          >
            <FaUsers className="text-lg" /> Owners
          </NavLink>

          <NavLink
            to="garages"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg transition ${
                isActive
                  ? "bg-purple-700 text-white"
                  : "text-purple-100 hover:bg-purple-700"
              }`
            }
          >
            <FaBuilding className="text-lg" /> Garages
          </NavLink>

          <NavLink
            to="services"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg transition ${
                isActive
                  ? "bg-purple-700 text-white"
                  : "text-purple-100 hover:bg-purple-700"
              }`
            }
          >
            <FaTools className="text-lg" /> Manage Services
          </NavLink>

          <NavLink
            to="bookings"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg transition ${
                isActive
                  ? "bg-purple-700 text-white"
                  : "text-purple-100 hover:bg-purple-700"
              }`
            }
          >
            <FaCalendarCheck className="text-lg" /> Bookings
          </NavLink>

          <NavLink
            to="reviews"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg transition ${
                isActive
                  ? "bg-purple-700 text-white"
                  : "text-purple-100 hover:bg-purple-700"
              }`
            }
          >
            <FaStar className="text-lg" /> Reviews
          </NavLink>

          <NavLink
            to="analytics"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg transition ${
                isActive
                  ? "bg-purple-700 text-white"
                  : "text-purple-100 hover:bg-purple-700"
              }`
            }
          >
            <FaChartBar className="text-lg" /> Analytics
          </NavLink>
        </nav>

        {/* Logout */}
        <div className="border-t border-purple-700 pt-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 p-3 rounded-lg text-sm font-medium transition"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <Outlet context={{ userRole: "garage_admin", stats, loading, reloadStats: loadStats }} />
        </div>
      </main>
    </div>
  );
};

export default GarageAdminDashboard;
