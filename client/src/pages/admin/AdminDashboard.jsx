import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, Routes, Route } from "react-router-dom";
import { FaUserCircle, FaBox, FaEnvelope } from "react-icons/fa";
import API from "../../services/api";
import AdminReviews from "./AdminReviews";
import AdminContactMessages from "./AdminContactMessages";
import AdminReports from "./AdminReports";
//import AdminBookings from "./AdminBookings";

const StatCard = ({ title, value, color = "bg-indigo-500" }) => (
  <div className="p-4 rounded-lg shadow-sm bg-white">
    <div className="text-sm text-gray-500">{title}</div>
    <div className="mt-2 flex items-center justify-between">
      <div className="text-2xl font-semibold text-gray-900">{value}</div>
      <div className={`${color} text-white px-3 py-1 rounded-full text-sm`}>View</div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [garagesCount, setGaragesCount] = useState(null);
  const [bookingsCount, setBookingsCount] = useState(null);
  const [reviewsCount, setReviewsCount] = useState(null);
  const [usersCount, setUsersCount] = useState(null);
  const [recentGarages, setRecentGarages] = useState([]);
  const [allGarages, setAllGarages] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [unreadContactsCount, setUnreadContactsCount] = useState(0);
  const [reports, setReports] = useState([]);

  const loadOverview = async () => {
    // Try to fetch some data from the API; if endpoint is missing, show N/A
     try {
       const token = localStorage.getItem("token");
       const { data } = await API.get("/garage/list", {
         headers: { Authorization: `Bearer ${token}` },
       });
       setGaragesCount(Array.isArray(data) ? data.length : null);
       setRecentGarages(Array.isArray(data) ? data.slice(0, 5) : []);
       setAllGarages(Array.isArray(data) ? data : []);
     } catch (e) {
       setGaragesCount(null);
       setRecentGarages([]);
       setAllGarages([]);
     }

    try {
      const token = localStorage.getItem("token");
      const { data } = await API.get("/booking/list", { headers: { Authorization: `Bearer ${token}` } });
     setBookingsCount(Array.isArray(data) ? data.length : null);
    } catch (e) {
      setBookingsCount(null);
    }

    try {
      const token = localStorage.getItem("token");
      const { data } = await API.get("/review/list", { headers: { Authorization: `Bearer ${token}` } });
      setReviewsCount(Array.isArray(data) ? data.length : null);
    } catch (e) {
      setReviewsCount(null);
    }

    try {
      const token = localStorage.getItem("token");
      const { data } = await API.get("/auth/users", { headers: { Authorization: `Bearer ${token}` } });
      setUsersCount(Array.isArray(data) ? data.length : null);
    } catch (e) {
      setUsersCount(null);
    }

    // Fetch feedbacks for admin
    try {
      const token = localStorage.getItem("token");
      const { data } = await API.get("/feedback/all", { headers: { Authorization: `Bearer ${token}` } });
      // Only show feedbacks that do NOT have a garageId (spare part feedbacks)
      // This ensures only customer feedback for spare parts is shown
      const filtered = Array.isArray(data?.data) ? data.data.filter(fb => !fb.garageId) : [];
      setFeedbacks(filtered);
    } catch (e) {
      setFeedbacks([]);
    }

    // Fetch unread contact messages count
    try {
      const token = localStorage.getItem("token");
      const { data } = await API.get("/contact/all", { headers: { Authorization: `Bearer ${token}` } });
      const unreadCount = Array.isArray(data?.data) ? data.data.filter(c => !c.isRead).length : 0;
      setUnreadContactsCount(unreadCount);
    } catch (e) {
      setUnreadContactsCount(0);
    }

    // Fetch reports for admin
    try {
      const token = localStorage.getItem("token");
      const { data } = await API.get("/reports", { headers: { Authorization: `Bearer ${token}` } });
      setReports(Array.isArray(data) ? data : []);
    } catch (e) {
      setReports([]);
    }
  };

  useEffect(() => {
    loadOverview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <aside className="w-64 bg-gray-800 text-white p-6 space-y-6">
        <div>
          <h2 className="text-xl font-bold">Admin Dashboard</h2>
          <p className="text-sm text-gray-300 mt-1">Site management & analytics</p>
        </div>

        <nav className="flex flex-col gap-2">
          <NavLink to="/admin-dashboard" className={({isActive}) => isActive ? "bg-gray-700 p-2 rounded" : "p-2 rounded hover:bg-gray-700"}>
            Overview
          </NavLink>
         <NavLink to="/admin-dashboard/garages" className={({isActive}) => isActive ? "bg-gray-700 p-2 rounded" : "p-2 rounded hover:bg-gray-700"}>
            Garages
          </NavLink>
          <NavLink to="/admin-dashboard/users" className={({isActive}) => isActive ? "bg-gray-700 p-2 rounded" : "p-2 rounded hover:bg-gray-700"}>
            Users
          </NavLink>
          <NavLink to="/admin-dashboard/categories" className={({isActive}) => isActive ? "flex items-center gap-2 bg-gray-700 p-2 rounded" : "flex items-center gap-2 p-2 rounded hover:bg-gray-700"}>
            <FaBox /> Categories
          </NavLink>
          <NavLink to="/admin-dashboard/orders" className={({isActive}) => isActive ? "bg-gray-700 p-2 rounded" : "p-2 rounded hover:bg-gray-700"}>
            Orders
          </NavLink>
          {/* <NavLink to="/admin-dashboard/bookings" className={({isActive}) => isActive ? "bg-gray-700 p-2 rounded" : "p-2 rounded hover:bg-gray-700"}>
            Bookings
          </NavLink> */}
          <NavLink to="/admin-dashboard/reviews" className={({isActive}) => isActive ? "bg-gray-700 p-2 rounded" : "p-2 rounded hover:bg-gray-700"}>
            Reviews
          </NavLink>
          <NavLink to="/admin-dashboard/contact-messages" className={({isActive}) => isActive ? "flex items-center gap-2 bg-gray-700 p-2 rounded" : "flex items-center gap-2 p-2 rounded hover:bg-gray-700"}>
            <FaEnvelope /> Contact Messages
            {unreadContactsCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {unreadContactsCount}
              </span>
            )}
          </NavLink>
        </nav>
      </aside>

      <main className="flex-1 p-6">
        <Routes>
          <Route path="reviews" element={<AdminReviews />} />
          {/* <Route path="bookings" element={<AdminBookings />} /> */}
          <Route path="contact-messages" element={<AdminContactMessages />} />
          <Route path="reports" element={<AdminReports />} />
          <Route
            path="garages"
            element={
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <h1 className="text-2xl font-semibold">All Garages</h1>
                  <div>
                    <button onClick={loadOverview} className="px-3 py-2 bg-indigo-600 text-white rounded shadow-sm">Refresh</button>
                  </div>
                </div>

                <section className="bg-white p-4 rounded shadow-sm">
                  {allGarages.length === 0 ? (
                    <div className="text-sm text-gray-500">No garages found.</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {allGarages.map((g) => (
                        <div key={g._id} className="border rounded p-4 bg-white shadow-sm">
                          <div className="font-semibold text-lg">{g.name}</div>
                          <div className="text-sm text-gray-500">{g.location}</div>
                          <div className="mt-2 text-sm">Services: <span className="font-medium">{g.services}</span></div>
                          <div className="mt-1 text-sm">Contact: <span className="font-medium">{g.contact}</span></div>
                          <div className="mt-2 text-xs text-gray-600">Availability: {g.availability ? "Open" : "Closed"}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </div>
            }
          />
          <Route
            path="*"
            element={
              <>
                <div className="mb-6 flex items-center justify-between">
                  <h1 className="text-2xl font-semibold">Overview</h1>

                  <div className="flex items-center gap-3">
                    <button onClick={loadOverview} className="px-3 py-2 bg-indigo-600 text-white rounded shadow-sm">Refresh</button>

                    {/* Account icon area (keeps admin dashboard independent but still allows account actions) */}
                    <div className="flex items-center gap-3 bg-white p-2 rounded shadow-sm">
                      <button onClick={handleAccount} className="flex items-center gap-2 text-gray-700">
                        <FaUserCircle size={20} />
                        <span className="text-sm">{user ? user.name : "Account"}</span>
                      </button>
                      <button onClick={handleLogout} className="px-2 py-1 bg-red-500 text-white rounded text-sm">Logout</button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                  <StatCard title="Garages" value={garagesCount !== null ? garagesCount : "N/A"} color="bg-indigo-600" />
                  {/* <StatCard title="Bookings" value={bookingsCount !== null ? bookingsCount : "N/A"} color="bg-green-600" /> */}
                  <StatCard title="Reviews" value={reviewsCount !== null ? reviewsCount : "N/A"} color="bg-yellow-600" />
                  <StatCard title="Users" value={usersCount !== null ? usersCount : "N/A"} color="bg-red-600" />
                  <StatCard title="Contact Messages" value={unreadContactsCount > 0 ? `${unreadContactsCount} New` : "0"} color="bg-purple-600" />
                </div>

                <section className="bg-white p-4 rounded shadow-sm mb-6">
                  <h2 className="text-lg font-medium mb-3">Recent Garages</h2>
                  {recentGarages.length === 0 ? (
                    <div className="text-sm text-gray-500">No garages found or endpoint unavailable.</div>
                  ) : (
                    <ul className="space-y-3">
                      {recentGarages.map((g) => (
                        <li key={g._id} className="flex items-center justify-between border p-3 rounded">
                          <div>
                            <div className="font-semibold">{g.name}</div>
                            <div className="text-xs text-gray-500">{g.location}</div>
                          </div>
                          <div className="text-sm text-gray-600">ID: <span className="font-mono">{g._id}</span></div>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>

                {/* Feedback/Reviews Section */}
                <section className="bg-white p-4 rounded shadow-sm">
                  <h2 className="text-lg font-medium mb-3">Customer Feedback</h2>
                  {feedbacks.length === 0 ? (
                    <div className="text-sm text-gray-500">No feedback found.</div>
                  ) : (
                    <ul className="space-y-4">
                      {feedbacks.map((fb) => (
                        <li key={fb._id} className="border p-4 rounded">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">{fb.rating === "Very Bad" ? "😠" : fb.rating === "Bad" ? "😟" : fb.rating === "Okay" ? "😐" : fb.rating === "Good" ? "😊" : fb.rating === "Excellent" ? "😍" : ""}</span>
                            <span className="font-semibold">{fb.rating}</span>
                            <span className="ml-auto text-xs text-gray-400">{new Date(fb.createdAt).toLocaleString()}</span>
                          </div>
                          <div className="mb-2 text-gray-700">{fb.feedback}</div>
                          <div className="flex justify-between text-sm text-gray-500">
                            <span>Recommend: <span className="font-bold">{fb.recommend}</span>/10</span>
                            <span>Email: {fb.email}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
                <section className="bg-white p-4 rounded shadow-sm mt-6">
                  <h2 className="text-lg font-medium mb-3">Incident Reports</h2>
                  {reports.length === 0 ? (
                    <div className="text-sm text-gray-500">No incident reports.</div>
                  ) : (
                    <ul className="space-y-4">
                      {reports.map((r) => (
                        <li key={r._id} className="border p-4 rounded">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-semibold">{r.type}</div>
                              <div className="text-sm text-gray-500">{r.location}</div>
                              <div className="mt-2 text-gray-700">{r.description}</div>
                            </div>
                            <div className="text-sm text-gray-500 text-right">
                              <div>{r.status}</div>
                              <div className="text-xs">{new Date(r.createdAt).toLocaleString()}</div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              </>
            }
          />
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboard;
