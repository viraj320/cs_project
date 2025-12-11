import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { FaTools, FaCalendarCheck, FaStar, FaUserCheck, FaSignOutAlt } from "react-icons/fa";
import axios from "axios";

const GaragePortal = () => {
  const [garages, setGarages] = useState([]);
  const [selectedId, setSelectedId] = useState(
    (typeof window !== "undefined" && localStorage.getItem("garageId")) || ""
  );
  const [loadingList, setLoadingList] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Check if user is authenticated and has proper role
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");

    if (!token || (userRole !== "garage_owner" && userRole !== "garage_admin")) {
      navigate("/login");
      return;
    }

    const userData = localStorage.getItem("userData");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);

  // Load garages based on user role
  const loadGarages = async () => {
    try {
      setLoadingList(true);
      const token = localStorage.getItem("token");
      const userRole = localStorage.getItem("userRole");

      const endpoint =
        userRole === "garage_owner"
          ? "http://localhost:5000/api/garage-owner/garages"
          : "http://localhost:5000/api/garage-admin/garages";

      const { data } = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setGarages(data || []);

      // If no selectedId yet, pick the first garage
      if ((!selectedId || !data.find((g) => g._id === selectedId)) && data.length) {
        setSelectedId(data[0]._id);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to load garage list");
    } finally {
      setLoadingList(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadGarages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist selection
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (selectedId) {
      localStorage.setItem("garageId", selectedId);
    } else {
      localStorage.removeItem("garageId");
    }
    const url = new URL(window.location.href);
    if (selectedId) url.searchParams.set("garageId", selectedId);
    else url.searchParams.delete("garageId");
    window.history.replaceState({}, "", url.toString());
  }, [selectedId]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userData");
    localStorage.removeItem("garageId");
    navigate("/login");
  };

  const userRole = localStorage.getItem("userRole");

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white p-5 space-y-5 shadow-lg">
        <div>
          <h1 className="text-2xl font-bold mb-2">Garage Portal</h1>
          <p className="text-sm text-gray-300">
            {userRole === "garage_owner" ? "Owner" : "Admin"}
          </p>
        </div>

        {user && (
          <div className="text-sm bg-blue-800 p-3 rounded">
            <p className="text-gray-200">Welcome,</p>
            <p className="font-semibold text-white">{user.name}</p>
          </div>
        )}

        {/* Active Garage selector */}
        <div className="mb-4">
          <label className="text-sm text-gray-200 block mb-1">Active Garage</label>
          <div className="flex gap-2">
            <select
              className="text-black p-2 rounded w-full text-sm"
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              disabled={loadingList || garages.length === 0}
            >
              {garages.length === 0 && <option value="">No garages found</option>}
              {garages.map((g) => (
                <option key={g._id} value={g._id}>
                  {g.name}
                </option>
              ))}
            </select>
            <button
              onClick={loadGarages}
              className="bg-blue-700 px-3 rounded text-sm"
              title="Reload garage list"
            >
              ↻
            </button>
          </div>
          {selectedId && (
            <div className="text-xs text-gray-300 mt-2 break-all">
              ID: <span className="font-mono">{selectedId}</span>
            </div>
          )}
        </div>

        <nav className="flex flex-col space-y-2">
          <NavLink
            to="services"
            className={({ isActive }) =>
              `hover:bg-blue-700 p-3 rounded flex items-center text-sm transition ${
                isActive ? "bg-blue-700" : ""
              }`
            }
          >
            <FaTools className="mr-2" /> Manage Services
          </NavLink>
          <NavLink
            to="bookings"
            className={({ isActive }) =>
              `hover:bg-blue-700 p-3 rounded flex items-center text-sm transition ${
                isActive ? "bg-blue-700" : ""
              }`
            }
          >
            <FaCalendarCheck className="mr-2" /> Booking Requests
          </NavLink>
          <NavLink
            to="visits"
            className={({ isActive }) =>
              `hover:bg-blue-700 p-3 rounded flex items-center text-sm transition ${
                isActive ? "bg-blue-700" : ""
              }`
            }
          >
            <FaUserCheck className="mr-2" /> Customer Visits
          </NavLink>
          <NavLink
            to="reviews"
            className={({ isActive }) =>
              `hover:bg-blue-700 p-3 rounded flex items-center text-sm transition ${
                isActive ? "bg-blue-700" : ""
              }`
            }
          >
            <FaStar className="mr-2" /> Reviews
          </NavLink>

          {userRole === "garage_owner" && (
            <NavLink
              to="admins"
              className={({ isActive }) =>
                `hover:bg-blue-700 p-3 rounded flex items-center text-sm transition ${
                  isActive ? "bg-blue-700" : ""
                }`
              }
            >
              <FaUserCheck className="mr-2" /> Manage Admins
            </NavLink>
          )}
        </nav>

        <div className="border-t border-blue-700 pt-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 p-2 rounded text-sm transition"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-white shadow-md overflow-auto">
        <Outlet context={{ garageId: selectedId, garages, reloadGarages: loadGarages }} />
      </main>
    </div>
  );
};

export default GaragePortal;
