import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { FaTools, FaCalendarCheck, FaStar, FaUserCheck, FaUserCircle } from "react-icons/fa";
import axios from "axios";

const GarageDashboard = () => {
  const [garages, setGarages] = useState([]);
  const [selectedId, setSelectedId] = useState(
    (typeof window !== "undefined" && localStorage.getItem("garageId")) || ""
  );
  const [loadingList, setLoadingList] = useState(true);
  const navigate = useNavigate();

  const userData =
    (typeof window !== "undefined" &&
      (localStorage.getItem("userData") || localStorage.getItem("user"))) ||
    null;
  const user = userData ? JSON.parse(userData) : null;

  const loadGarages = async () => {
    try {
      setLoadingList(true);
      const { data } = await axios.get("http://localhost:5000/api/garage/list");
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

  // Persist selection + reflect on URL
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

    // Optional: dispatch event if children want to listen
    window.dispatchEvent(new CustomEvent("garageIdChange", { detail: { garageId: selectedId } }));
  }, [selectedId]);

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
      <aside className="w-64 bg-blue-900 text-white p-5 space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold mb-3">Garage Dashboard</h1>
          <div className="flex items-center gap-2">
            <button onClick={handleAccount} className="flex items-center gap-2 text-sm bg-blue-800 p-2 rounded">
              <FaUserCircle />
              <span className="hidden sm:inline">{user ? user.name : "Account"}</span>
            </button>
            <button onClick={handleLogout} className="ml-2 bg-red-600 p-2 rounded text-sm">Logout</button>
          </div>
        </div>

        {/* Active Garage selector */}
        <div className="mb-4">
          <label className="text-sm text-gray-200 block mb-1">Active Garage</label>
          <div className="flex gap-2">
            <select
              className="text-black p-2 rounded w-full"
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
              className="bg-blue-700 px-3 rounded"
              title="Reload garage list"
            >
              ↻
            </button>
          </div>
          {selectedId && (
            <div className="text-xs text-gray-200 mt-1 break-all">
              ID: <span className="font-mono">{selectedId}</span>
            </div>
          )}
        </div>

        <nav className="flex flex-col space-y-4">
          <NavLink to="services" className="hover:bg-blue-700 p-2 rounded flex items-center">
            <FaTools className="mr-2" /> Manage Services
          </NavLink>
          <NavLink to="bookings" className="hover:bg-blue-700 p-2 rounded flex items-center">
            <FaCalendarCheck className="mr-2" /> Booking Requests
          </NavLink>
          <NavLink to="visits" className="hover:bg-blue-700 p-2 rounded flex items-center">
            <FaUserCheck className="mr-2" /> Customer Visits
          </NavLink>
          <NavLink to="reviews" className="hover:bg-blue-700 p-2 rounded flex items-center">
            <FaStar className="mr-2" /> Reviews
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-white shadow-md">
        {/* We pass context too, if children want to read it */}
        <Outlet context={{ garageId: selectedId, garages, reloadGarages: loadGarages }} />
      </main>
    </div>
  );
};

export default GarageDashboard;