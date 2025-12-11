import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEye, FaTimes } from "react-icons/fa";

const AdminBookings = () => {
  const [garages, setGarages] = useState([]);
  const [selected, setSelected] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loadingGarages, setLoadingGarages] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [viewBooking, setViewBooking] = useState(null);
  const [error, setError] = useState(null);

  const loadGarages = async () => {
    setLoadingGarages(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("http://localhost:5000/api/garage-admin/garages", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGarages(data || []);
      if (data && data.length) {
        if (!selected || !data.find((g) => g._id === selected)) {
          setSelected(data[0]._id);
        }
      }
    } catch (e) {
      console.error("Error loading managed garages", e);
      setError("Failed to load garages. Please refresh.");
    } finally {
      setLoadingGarages(false);
    }
  };

  const loadBookings = async (garageId) => {
    if (!garageId) {
      setBookings([]);
      return;
    }
    setLoadingBookings(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`http://localhost:5000/api/garage-admin/garage/${garageId}/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(data || []);
    } catch (e) {
      console.error("Error loading bookings", e);
      // alert("Failed to load bookings");
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    loadGarages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selected) {
      loadBookings(selected);
    } else {
      setBookings([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const handleStatusChange = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/garage-admin/garage/${selected}/bookings/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBookings((prev) => prev.map((b) => (b._id === id ? { ...b, status } : b)));
      if (viewBooking && viewBooking._id === id) {
        setViewBooking((prev) => ({ ...prev, status }));
      }
    } catch (e) {
      console.error("Failed to update booking", e);
      alert("Failed to update booking status");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Managed Garage Bookings</h2>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <div className="mb-6 bg-white p-4 rounded shadow-sm border">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Garage</label>
        <div className="flex gap-3">
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="p-2 border rounded w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loadingGarages}
          >
            {loadingGarages && <option>Loading garages...</option>}
            {!loadingGarages && garages.length === 0 && <option value="">No garages found</option>}
            {!loadingGarages && garages.length > 0 && (
              <>
                {garages.map((g) => (
                  <option key={g._id} value={g._id}>{g.name}</option>
                ))}
              </>
            )}
          </select>
          <button 
            onClick={loadGarages} 
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 border"
          >
            Refresh List
          </button>
          <button 
            onClick={() => loadBookings(selected)} 
            disabled={!selected || loadingBookings}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
          >
            Refresh Bookings
          </button>
        </div>
      </div>

      {loadingBookings ? (
        <div className="text-center py-8 text-gray-500">Loading bookings...</div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded border">
          {selected ? "No bookings found for this garage." : "Please select a garage."}
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded shadow border">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium">{b.customerName || b.customerId?.name || 'Unknown'}</div>
                    <div className="text-xs text-gray-500">{b.customerEmail || b.customerId?.email || '-'}</div>
                  </td>
                  <td className="px-4 py-3">{b.service}</td>
                  <td className="px-4 py-3">
                    {b.date ? new Date(b.date).toLocaleDateString() : (b.createdAt ? new Date(b.createdAt).toLocaleDateString() : '-')}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      b.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                      b.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => setViewBooking(b)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      <button 
                        onClick={() => handleStatusChange(b._id, 'Accepted')} 
                        className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 disabled:opacity-50" 
                        disabled={b.status === 'Accepted'}
                      >
                        Accept
                      </button>
                      <button 
                        onClick={() => handleStatusChange(b._id, 'Rejected')} 
                        className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 disabled:opacity-50" 
                        disabled={b.status === 'Rejected'}
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

      {/* Booking Details Modal */}
      {viewBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b bg-gray-50">
              <h3 className="font-bold text-lg">Booking Details</h3>
              <button onClick={() => setViewBooking(null)} className="text-gray-500 hover:text-gray-700">
                <FaTimes />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <label className="text-xs text-gray-500 uppercase font-semibold">Customer</label>
                <p>{viewBooking.customerName || viewBooking.customerId?.name || 'Unknown'}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase font-semibold">Contact</label>
                <p>{viewBooking.customerEmail || viewBooking.customerId?.email || '-'}</p>
                <p>{viewBooking.customerPhone || viewBooking.customerId?.businessPhone || '-'}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase font-semibold">Service</label>
                <p>{viewBooking.service}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase font-semibold">Date & Time</label>
                <p>{viewBooking.date ? new Date(viewBooking.date).toLocaleString() : '-'}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase font-semibold">Status</label>
                <p className={`font-medium ${
                  viewBooking.status === 'Accepted' ? 'text-green-600' :
                  viewBooking.status === 'Rejected' ? 'text-red-600' :
                  'text-yellow-600'
                }`}>{viewBooking.status}</p>
              </div>
              <div className="pt-4 flex gap-2">
                <button 
                  onClick={() => handleStatusChange(viewBooking._id, 'Accepted')} 
                  className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
                  disabled={viewBooking.status === 'Accepted'}
                >
                  Accept
                </button>
                <button 
                  onClick={() => handleStatusChange(viewBooking._id, 'Rejected')} 
                  className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 disabled:opacity-50"
                  disabled={viewBooking.status === 'Rejected'}
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
