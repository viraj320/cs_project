import React, { useEffect, useState } from "react";
import API from "../../services/api";

const AdminSubscribers = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await API.get("/newsletter");
      setSubscribers(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (err) {
      console.error("Failed to load subscribers", err);
      setError("Failed to load subscribers");
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Newsletter Subscribers</h1>
        <button
          onClick={load}
          className="px-3 py-2 bg-indigo-600 text-white rounded shadow-sm text-sm"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-gray-600">Loading...</div>
      ) : error ? (
        <div className="text-red-600 text-sm">{error}</div>
      ) : subscribers.length === 0 ? (
        <div className="text-gray-500">No subscribers yet.</div>
      ) : (
        <div className="overflow-x-auto bg-white shadow-sm rounded">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Subscribed At</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((s) => (
                <tr key={s._id} className="border-t">
                  <td className="px-4 py-3 font-medium">{s.email}</td>
                  <td className="px-4 py-3 text-gray-600">{new Date(s.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminSubscribers;
