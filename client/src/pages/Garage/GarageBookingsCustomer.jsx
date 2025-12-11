import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import {
  FaSync,
  FaCalendarAlt,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaTools,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

const GarageBookingsCustomer = () => {
  const outlet = useOutletContext();
  const customerId = outlet?.userId;

  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Fetch bookings by customer ID
  const fetchBookings = async () => {
    if (!customerId) {
      console.error("Customer ID not found");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/garage/bookings`,
        {
          params: { customerId },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBookings(response.data || []);
      setFilteredBookings(response.data || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      alert("Failed to load your bookings");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId]);

  // Filter bookings based on search term and status
  useEffect(() => {
    let filtered = bookings;

    // Apply status filter
    if (statusFilter !== "All") {
      filtered = filtered.filter((b) => b.status === statusFilter);
    }

    // Apply search filter (search by garage ID, service, or customer name)
    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.garageId?.toLowerCase().includes(lowerSearch) ||
          b.service?.toLowerCase().includes(lowerSearch) ||
          b.customerName?.toLowerCase().includes(lowerSearch)
      );
    }

    setFilteredBookings(filtered);
  }, [searchTerm, statusFilter, bookings]);

  // Handle status change
  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/garage/bookings/${bookingId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: newStatus } : b))
      );
    } catch (error) {
      console.error("Error updating booking status:", error);
      alert("Failed to update booking status");
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Accepted":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "Accepted":
        return <FaCheckCircle className="text-green-600" />;
      case "Rejected":
        return <FaTimesCircle className="text-red-600" />;
      case "Pending":
        return <FaClock className="text-yellow-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">My Bookings</h2>
        <p className="text-gray-600">
          View and manage your service booking requests
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <input
              type="text"
              placeholder="Search by service, garage, or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Refresh Button */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={fetchBookings}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            <FaSync className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <div className="text-sm text-gray-600 self-center">
            Showing {filteredBookings.length} of {bookings.length} bookings
          </div>
        </div>
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin">
            <FaSync className="text-4xl text-blue-600" />
          </div>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <p className="text-gray-500 text-lg">
            {bookings.length === 0
              ? "No bookings yet. Make your first booking!"
              : "No bookings match your filters."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredBookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column - Booking Details */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-800">
                      <FaTools className="inline mr-2 text-blue-600" />
                      {booking.service}
                    </h3>
                    <div
                      className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {getStatusIcon(booking.status)}
                      {booking.status}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-3 space-y-3">
                    <div className="flex items-center gap-3">
                      <FaCalendarAlt className="text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Booking Date</p>
                        <p className="text-gray-800 font-medium">
                          {booking.date
                            ? new Date(booking.date).toLocaleDateString(
                                "en-US",
                                {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )
                            : "-"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <FaClock className="text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Booking Time</p>
                        <p className="text-gray-800 font-medium">
                          {booking.date
                            ? new Date(booking.date).toLocaleTimeString(
                                "en-US",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )
                            : "-"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Customer Details */}
                <div className="space-y-4">
                  <h4 className="text-md font-bold text-gray-800 mb-3">
                    Customer Information
                  </h4>

                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div className="flex items-center gap-3">
                      <FaUser className="text-blue-600" />
                      <div>
                        <p className="text-xs text-gray-500">Name</p>
                        <p className="text-gray-800 font-medium">
                          {booking.customerName || "-"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <FaEnvelope className="text-blue-600" />
                      <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="text-gray-800 font-medium text-sm">
                          {booking.customerEmail || "-"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <FaPhone className="text-blue-600" />
                      <div>
                        <p className="text-xs text-gray-500">Phone</p>
                        <p className="text-gray-800 font-medium">
                          {booking.customerPhone || "-"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Booking ID */}
                  <div className="text-xs text-gray-500 break-all">
                    Booking ID:{" "}
                    <span className="font-mono text-gray-700">
                      {booking._id}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-gray-200 flex gap-2">
                {booking.status === "Pending" && (
                  <>
                    <button
                      onClick={() =>
                        handleStatusChange(booking._id, "Accepted")
                      }
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition font-medium"
                    >
                      <FaCheckCircle className="inline mr-2" />
                      Accept
                    </button>
                    <button
                      onClick={() =>
                        handleStatusChange(booking._id, "Rejected")
                      }
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition font-medium"
                    >
                      <FaTimesCircle className="inline mr-2" />
                      Reject
                    </button>
                  </>
                )}
                {(booking.status === "Accepted" ||
                  booking.status === "Rejected") && (
                  <div className="flex-1 text-center py-2 text-gray-600">
                    This booking has been {booking.status.toLowerCase()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GarageBookingsCustomer;
