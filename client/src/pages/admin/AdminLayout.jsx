import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, Outlet } from "react-router-dom";
import { FaUserCircle, FaBox, FaBuilding, FaUsers, FaShoppingCart, FaStar, FaBars, FaTimes, FaCog, FaEnvelope, FaCalendarCheck, FaRegEnvelopeOpen, FaExclamationTriangle } from "react-icons/fa";
import { MdHomeWork } from "react-icons/md";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const userData =
    (typeof window !== "undefined" &&
      (localStorage.getItem("userData") || localStorage.getItem("user"))) ||
    null;
  const user = userData ? JSON.parse(userData) : null;

  const handleAccount = () => {
    navigate("/account");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userData");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-gray-800 text-white p-4 space-y-6 transition-all duration-300 fixed h-full overflow-y-auto lg:static`}
      >
        <div className="flex items-center justify-between mb-6">
          {sidebarOpen && <h2 className="text-xl font-bold">Admin Panel</h2>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-xl"
          >
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        <nav className="flex flex-col gap-2">
          <NavLink
            to="/admin-dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded transition ${
                isActive
                  ? "bg-indigo-600"
                  : "hover:bg-gray-700"
              }`
            }
            title={sidebarOpen ? "" : "Overview"}
          >
            <FaUsers className="text-lg" />
            {sidebarOpen && "Overview"}
          </NavLink>

           <NavLink
            to="/admin-dashboard/garages"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded transition ${
                isActive
                  ? "bg-indigo-600"
                  : "hover:bg-gray-700"
              }`
            }
            title={sidebarOpen ? "" : "Garages"}
          >
            <FaBuilding className="text-lg" />
            {sidebarOpen && "Garages"}
          </NavLink> 

          <NavLink
            to="/admin-dashboard/users"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded transition ${
                isActive
                  ? "bg-indigo-600"
                  : "hover:bg-gray-700"
              }`
            }
            title={sidebarOpen ? "" : "Users"}
          >
            <FaUsers className="text-lg" />
            {sidebarOpen && "Users"}
          </NavLink>

          <NavLink
            to="/admin-dashboard/categories"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded transition ${
                isActive
                  ? "bg-indigo-600"
                  : "hover:bg-gray-700"
              }`
            }
            title={sidebarOpen ? "" : "Categories"}
          >
            <FaBox className="text-lg" />
            {sidebarOpen && "Categories"}
          </NavLink>

          <NavLink
            to="/admin-dashboard/spare-parts"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded transition ${
                isActive
                  ? "bg-indigo-600"
                  : "hover:bg-gray-700"
              }`
            }
            title={sidebarOpen ? "" : "Spare Parts"}
          >
            <FaCog className="text-lg" />
            {sidebarOpen && "Spare Parts"}
          </NavLink>

          <NavLink
            to="/admin-dashboard/orders"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded transition ${
                isActive
                  ? "bg-indigo-600"
                  : "hover:bg-gray-700"
              }`
            }
            title={sidebarOpen ? "" : "Orders"}
          >
            <FaShoppingCart className="text-lg" />
            {sidebarOpen && "Orders"}
          </NavLink>

          {/* <NavLink
            to="/admin-dashboard/bookings"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded transition ${
                isActive
                  ? "bg-indigo-600"
                  : "hover:bg-gray-700"
              }`
            }
            title={sidebarOpen ? "" : "Bookings"}
          >
            <FaCalendarCheck className="text-lg" />
            {sidebarOpen && "Bookings"}
          </NavLink> */}

          <NavLink
            to="/admin-dashboard/reviews"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded transition ${
                isActive
                  ? "bg-indigo-600"
                  : "hover:bg-gray-700"
              }`
            }
            title={sidebarOpen ? "" : "Reviews"}
          >
            <FaStar className="text-lg" />
            {sidebarOpen && "Reviews"}
          </NavLink>

          <NavLink
            to="/admin-dashboard/home-sections"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded transition ${
                isActive
                  ? "bg-indigo-600"
                  : "hover:bg-gray-700"
              }`
            }
            title={sidebarOpen ? "" : "Homepage Collections"}
          >
            <MdHomeWork className="text-lg" />
            {sidebarOpen && "Homepage Collections"}
          </NavLink>

          <NavLink
            to="/admin-dashboard/reports"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded transition ${
                isActive
                  ? "bg-indigo-600"
                  : "hover:bg-gray-700"
              }`
            }
            title={sidebarOpen ? "" : "Reports"}
          >
            <FaExclamationTriangle className="text-lg" />
            {sidebarOpen && "Reports"}
          </NavLink>

          <NavLink
            to="/admin-dashboard/subscribers"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded transition ${
                isActive
                  ? "bg-indigo-600"
                  : "hover:bg-gray-700"
              }`
            }
            title={sidebarOpen ? "" : "Subscribers"}
          >
            <FaRegEnvelopeOpen className="text-lg" />
            {sidebarOpen && "Subscribers"}
          </NavLink>

          <NavLink
            to="/admin-dashboard/contact-messages"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded transition ${
                isActive
                  ? "bg-indigo-600"
                  : "hover:bg-gray-700"
              }`
            }
            title={sidebarOpen ? "" : "Contact Messages"}
          >
            <FaEnvelope className="text-lg" />
            {sidebarOpen && "Contact Messages"}
          </NavLink>
        </nav>

        {/* User Section */}
        <div className="border-t border-gray-700 pt-4 mt-auto">
          {sidebarOpen && user && (
            <div className="text-xs mb-3">
              <p className="text-gray-300">Logged in as</p>
              <p className="font-semibold truncate">{user.name}</p>
            </div>
          )}
          <div className="flex gap-2">
            <button
              onClick={handleAccount}
              className="flex items-center justify-center gap-2 flex-1 bg-gray-700 hover:bg-gray-600 p-2 rounded text-sm transition"
              title="Account"
            >
              <FaUserCircle className="text-lg" />
              {sidebarOpen && "Account"}
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-2 py-2 rounded text-sm transition"
              title="Logout"
            >
              {sidebarOpen ? "Logout" : "↪"}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
