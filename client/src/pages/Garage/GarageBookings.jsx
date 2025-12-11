import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom"; // CHANGE: ensure we import this
import axios from "axios";

const GarageBookings = () => {
  // Read garageId from Outlet context (Dashboard selection)
  const outlet = useOutletContext();
  const ctxGarageId = outlet?.garageId;

  // garageId priority: Dashboard context -> localStorage -> empty
  const initialId =
    (ctxGarageId || localStorage.getItem("garageId") || "");

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeGarageId, setActiveGarageId] = useState(initialId);

  const updateUrlParam = (id) => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location);
    if (id) url.searchParams.set("garageId", id);
    else url.searchParams.delete("garageId");
    window.history.replaceState({}, "", url);
  };

  // Sync with Dashboard selection (when user changes active garage)
  useEffect(() => {
    if (ctxGarageId !== undefined) {
      const id = ctxGarageId || "";
      setActiveGarageId(id);
      if (id) localStorage.setItem("garageId", id);
      else localStorage.removeItem("garageId");
      updateUrlParam(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctxGarageId]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/garage/bookings", {
        params: activeGarageId ? { garageId: activeGarageId } : undefined,
      });
      setBookings(response.data || []);
    } catch (error) {
      console.error(error);
      alert("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch when activeGarageId changes
  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeGarageId]);

  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/garage/bookings/${id}`, { status });
      setBookings((prev) => prev.map((b) => (b._id === id ? { ...b, status } : b)));
    } catch (error) {
      console.error(error);
      alert("Failed to update status");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Customer Booking Requests</h2>

      {loading ? (
        <p className="text-gray-600">Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <div className="p-6 text-center bg-gray-50 rounded-lg">
          <p className="text-gray-500">No bookings found</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full">
            <thead className="bg-gray-200 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Customer Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Phone</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Service</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{booking.customerName}</td>
                  <td className="px-4 py-3 text-sm">{booking.customerEmail || "-"}</td>
                  <td className="px-4 py-3 text-sm">{booking.customerPhone || "-"}</td>
                  <td className="px-4 py-3 text-sm">{booking.service}</td>
                  <td className="px-4 py-3 text-sm">
                    {booking.date ? new Date(booking.date).toLocaleDateString() : "-"}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        booking.status === "Accepted"
                          ? "bg-green-100 text-green-800"
                          : booking.status === "Rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-center">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => handleStatusChange(booking._id, "Accepted")}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs"
                        disabled={booking.status === "Accepted"}
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleStatusChange(booking._id, "Rejected")}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
                        disabled={booking.status === "Rejected"}
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GarageBookings;