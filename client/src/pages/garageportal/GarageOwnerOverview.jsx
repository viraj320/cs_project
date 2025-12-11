import React, { useEffect } from "react";
import { useOutletContext, Link } from "react-router-dom";
import { FaSpinner, FaBuilding, FaCalendarCheck, FaStar, FaSync } from "react-icons/fa";

const StatCard = ({ title, value, icon, color, link }) => (
  <Link to={link} className={`block p-6 rounded-lg shadow-lg transition hover:shadow-xl ${color}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-white uppercase">{title}</p>
        <p className="text-3xl font-bold text-white">{value}</p>
      </div>
      <div className="text-4xl text-white opacity-50">{icon}</div>
    </div>
  </Link>
);

const RecentItem = ({ item, type }) => {
  const isBooking = type === 'booking';
  const title = isBooking ? item.service : `Rating: ${item.rating || 'N/A'}`;
  const subtitle = isBooking
    ? `Customer: ${item.customerName || item.customerId?.name || 'N/A'}`
    : item.comment || 'No comment';
  const garageName = item.garageId?.name || 'Unknown Garage';
  const date = new Date(item.createdAt).toLocaleDateString();

  return (
    <li className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
      <div>
        <p className="font-semibold text-gray-800">{title}</p>
        <p className="text-sm text-gray-600 truncate" title={subtitle}>{subtitle}</p>
        <p className="text-xs text-gray-500">{garageName}</p>
      </div>
      <p className="text-xs text-gray-500">{date}</p>
    </li>
  );
};

const GarageOwnerOverview = () => {
  const { stats, loading, reloadStats } = useOutletContext();

  useEffect(() => {
    if (reloadStats) {
      reloadStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading && !stats?.totalGarages) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
        <p className="ml-4 text-gray-600">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Owner Overview</h1>
          <p className="text-gray-600">Performance dashboard for your garages.</p>
        </div>
        <button onClick={reloadStats} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 text-gray-700 transition">
          <FaSync className={loading ? "animate-spin text-blue-600" : "text-gray-500"} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="My Garages"
          value={stats.totalGarages}
          icon={<FaBuilding />}
          color="bg-gradient-to-r from-blue-500 to-blue-600"
          link="#"
        />
        <StatCard
          title="Total Bookings"
          value={stats.totalBookings}
          icon={<FaCalendarCheck />}
          color="bg-gradient-to-r from-green-500 to-green-600"
          link="../bookings"
        />
        <StatCard
          title="Total Reviews"
          value={stats.totalReviews}
          icon={<FaStar />}
          color="bg-gradient-to-r from-yellow-500 to-yellow-600"
          link="../reviews"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Bookings */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
          {stats.recentBookings?.length > 0 ? (
            <ul className="space-y-3">
              {stats.recentBookings.map(booking => (
                <RecentItem key={booking._id} item={booking} type="booking" />
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No recent bookings found.</p>
          )}
        </div>

        {/* Recent Reviews */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Recent Reviews</h2>
          {stats.recentReviews?.length > 0 ? (
            <ul className="space-y-3">
              {stats.recentReviews.map(review => (
                <RecentItem key={review._id} item={review} type="review" />
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No recent reviews found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GarageOwnerOverview;