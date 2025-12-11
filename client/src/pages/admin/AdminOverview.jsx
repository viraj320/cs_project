import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { FaSpinner } from "react-icons/fa";

const StatCard = ({ title, value, color = "bg-indigo-500" }) => (
  <div className="p-4 rounded-lg shadow-sm bg-white">
    <div className="text-sm text-gray-500">{title}</div>
    <div className="mt-2 flex items-center justify-between">
      <div className="text-2xl font-semibold text-gray-900">{value}</div>
      <div className={`${color} text-white px-3 py-1 rounded-full text-sm`}>View</div>
    </div>
  </div>
);

const AdminOverview = () => {
  const [garagesCount, setGaragesCount] = useState(null);
  const [bookingsCount, setBookingsCount] = useState(null);
  const [reviewsCount, setReviewsCount] = useState(null);
  const [usersCount, setUsersCount] = useState(null);
  const [categoriesCount, setCategoriesCount] = useState(null);
  const [contactCounts, setContactCounts] = useState({ total: 0, unread: 0 });
  const [bookingCount, setBookingCount] = useState(null);
  const [recentGarages, setRecentGarages] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOverview = async () => {
    setLoading(true);
    try {
      const { data: garages } = await API.get("/garage/list");
      setGaragesCount(Array.isArray(garages) ? garages.length : null);
      setRecentGarages(Array.isArray(garages) ? garages.slice(0, 5) : []);
    } catch (e) {
      setGaragesCount(null);
      setRecentGarages([]);
    }

    try {
      const { data: bookings } = await API.get("/booking/list");
      const total = Array.isArray(bookings) ? bookings.length : null;
      setBookingsCount(total);
      setBookingCount(total);
    } catch (e) {
      setBookingsCount(null);
      setBookingCount(null);
    }

    try {
      const { data: reviews } = await API.get("/review/list");
      setReviewsCount(Array.isArray(reviews) ? reviews.length : null);
    } catch (e) {
      setReviewsCount(null);
    }

    try {
      const { data: users } = await API.get("/auth/users");
      setUsersCount(Array.isArray(users) ? users.length : null);
    } catch (e) {
      setUsersCount(null);
    }

    try {
      const { data: categories } = await API.get("/categories");
      setCategoriesCount(Array.isArray(categories) ? categories.length : null);
    } catch (e) {
      setCategoriesCount(null);
    }

    try {
      const { data } = await API.get("/contact/all");
      const total = Array.isArray(data?.data) ? data.data.length : 0;
      const unread = Array.isArray(data?.data) ? data.data.filter((c) => !c.isRead).length : 0;
      setContactCounts({ total, unread });
    } catch (e) {
      setContactCounts({ total: 0, unread: 0 });
    }

    setLoading(false);
  };

  useEffect(() => {
    loadOverview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <button
          onClick={loadOverview}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition flex items-center gap-2"
        >
          {loading ? <FaSpinner className="animate-spin" /> : "Refresh"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
        <StatCard
          title="Garages"
          value={garagesCount !== null ? garagesCount : "N/A"}
          color="bg-indigo-600"
        />
        <StatCard
          title="Bookings"
          value={bookingsCount !== null ? bookingsCount : "N/A"}
          color="bg-green-600"
        />
        <StatCard
          title="Reviews"
          value={reviewsCount !== null ? reviewsCount : "N/A"}
          color="bg-yellow-600"
        />
        <StatCard
          title="Users"
          value={usersCount !== null ? usersCount : "N/A"}
          color="bg-red-600"
        />
        <StatCard
          title="Categories"
          value={categoriesCount !== null ? categoriesCount : "N/A"}
          color="bg-purple-600"
        />
        <StatCard
          title="Contact Messages"
          value={contactCounts.unread > 0 ? `${contactCounts.unread} New` : contactCounts.total}
          color="bg-blue-600"
        />
        <StatCard
          title="Bookings Detail"
          value={bookingCount !== null ? bookingCount : "N/A"}
          color="bg-teal-600"
        />
      </div>

      <section className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Recent Garages</h2>
        {recentGarages.length === 0 ? (
          <div className="text-sm text-gray-500">No garages found or endpoint unavailable.</div>
        ) : (
          <div className="space-y-3">
            {recentGarages.map((g) => (
              <div key={g._id} className="flex items-center justify-between border p-3 rounded hover:bg-gray-50">
                <div>
                  <div className="font-semibold">{g.name}</div>
                  <div className="text-xs text-gray-500">{g.location}</div>
                </div>
                <div className="text-sm text-gray-600">
                  ID: <span className="font-mono text-xs">{g._id}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminOverview;
