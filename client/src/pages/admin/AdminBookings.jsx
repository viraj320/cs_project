import React, { useEffect, useState, useMemo } from "react";
import API from "../../services/api";
import { FaSync, FaEye } from "react-icons/fa";

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800",
  Accepted: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
};

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, Pending, Accepted, Rejected
  const [partsOnly, setPartsOnly] = useState(false); // home page parts bookings
  const [selected, setSelected] = useState(null);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/booking/list");
      setBookings(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Error loading bookings", e);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const filtered = useMemo(() => {
    let list = bookings;
    if (partsOnly) {
      list = list.filter((b) => {
        if (b.isPartsBooking) return true;
        if (typeof b.service === "string") {
          const s = b.service.toLowerCase();
          return s.startsWith("parts booking") || s.startsWith("booking for");
        }
        return false;
      });
    }
    if (filter === "all") return list;
    return list.filter((b) => b.status === filter);
  }, [bookings, filter, partsOnly]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Bookings</h1>
          <p className="text-gray-600 text-sm">View customer booking requests. Use "Parts Booking" toggle to see only bookings coming from homepage parts.</p>
        </div>
        <button
          onClick={loadBookings}
          className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          <FaSync className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {["all", "Pending", "Accepted", "Rejected"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1 rounded text-sm ${
              filter === s ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            {s === "all" ? "All" : s}
          </button>
        ))}

        <button
          onClick={() => setPartsOnly((p) => !p)}
          className={`px-3 py-1 rounded text-sm border ${
            partsOnly ? "bg-teal-600 text-white border-teal-600" : "bg-white text-gray-700 border-gray-300"
          }`}
        >
          {partsOnly ? "Parts Booking: ON" : "Parts Booking"}
        </button>
      </div>

      {loading ? (
        <div className="text-gray-500">Loading bookings...</div>
      ) : filtered.length === 0 ? (
        <div className="text-gray-500">No bookings found.</div>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b._id} className="border-t">
                  <td className="px-4 py-3 font-semibold">{b.customerName || "-"}</td>
                  <td className="px-4 py-3">{b.customerEmail || "-"}</td>
                  <td className="px-4 py-3">{b.customerPhone || "-"}</td>
                  <td className="px-4 py-3">{b.service}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[b.status] || "bg-gray-100 text-gray-700"}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{b.date ? new Date(b.date).toLocaleString() : "-"}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{b.createdAt ? new Date(b.createdAt).toLocaleString() : "-"}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelected(b)}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                    >
                      <FaEye /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg max-w-lg w-full p-6 relative">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4">Booking Details</h3>
            <div className="space-y-2 text-sm">
              <div><strong>Customer:</strong> {selected.customerName || "-"}</div>
              <div><strong>Email:</strong> {selected.customerEmail || "-"}</div>
              <div><strong>Phone:</strong> {selected.customerPhone || "-"}</div>
              <div><strong>Service:</strong> {selected.service}</div>
              <div><strong>Status:</strong> {selected.status}</div>
              <div><strong>Date:</strong> {selected.date ? new Date(selected.date).toLocaleString() : "-"}</div>
              <div><strong>Garage:</strong> {selected.garageId || "Not assigned"}</div>
              <div><strong>Created:</strong> {selected.createdAt ? new Date(selected.createdAt).toLocaleString() : "-"}</div>
              <div><strong>Updated:</strong> {selected.updatedAt ? new Date(selected.updatedAt).toLocaleString() : "-"}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
