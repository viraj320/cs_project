import React, { useEffect, useState } from 'react';
import API from '../../services/api';

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const loadReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const { data } = await API.get('/reports', { headers: { Authorization: `Bearer ${token}` } });
      setReports(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setError(e.response?.data?.message || e.message || 'Failed to load reports');
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadReports(); }, []);

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      const token = localStorage.getItem('token');
      await API.put(`/reports/${id}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } });
      setReports((prev) => prev.map(r => r._id === id ? { ...r, status } : r));
    } catch (e) {
      console.error(e);
      setError(e.response?.data?.message || e.message || 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <div className="p-6 bg-white rounded shadow-sm">Loading reports...</div>;
  if (error) return (
    <div className="p-6 bg-white rounded shadow-sm">
      <div className="text-red-600 font-semibold">{error}</div>
      <button onClick={loadReports} className="mt-4 px-3 py-2 bg-blue-600 text-white rounded">Retry</button>
    </div>
  );

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Incident Reports</h1>
        <button onClick={loadReports} className="px-3 py-2 bg-indigo-600 text-white rounded">Refresh</button>
      </div>

      {reports.length === 0 ? (
        <div className="text-sm text-gray-500">No reports found.</div>
      ) : (
        <ul className="space-y-4">
          {reports.map(r => (
            <li key={r._id} className="border p-4 rounded bg-white">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-semibold">{r.type} — <span className="text-sm text-gray-500">{r.location}</span></div>
                  <div className="text-sm text-gray-700 mt-2">{r.description}</div>
                  <div className="text-xs text-gray-400 mt-2">Reported: {new Date(r.createdAt).toLocaleString()}</div>
                  {r.reporter && <div className="text-xs text-gray-400">Reporter: {r.reporter.name || r.reporter.email}</div>}
                </div>

                <div className="flex flex-col items-end gap-2">
                  <select value={r.status} onChange={(e) => updateStatus(r._id, e.target.value)} className="border rounded px-2 py-1">
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                  <div className="text-sm text-gray-500">{updatingId === r._id ? 'Updating...' : r.status}</div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminReports;
