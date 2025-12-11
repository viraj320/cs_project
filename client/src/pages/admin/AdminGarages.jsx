import React, { useEffect, useState } from 'react';
import API from '../../services/api';

const AdminGarages = () => {
  const [garages, setGarages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadGarages = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const { data } = await API.get('/garage/list', { headers: { Authorization: `Bearer ${token}` } });
      setGarages(Array.isArray(data) ? data : []);
    } catch (e) {
      const msg = e.response?.data?.message || e.message || 'Failed to load garages.';
      setError(msg);
      setGarages([]);
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGarages();
  }, []);

  if (loading) return <div className="p-6 bg-white rounded shadow-sm">Loading garages...</div>;
  if (error) return (
    <div className="p-6 bg-white rounded shadow-sm">
      <div className="text-red-600 font-semibold">{error}</div>
      <button onClick={loadGarages} className="mt-4 px-3 py-2 bg-blue-600 text-white rounded">Retry</button>
    </div>
  );

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Garages</h1>
        <button onClick={loadGarages} className="px-3 py-2 bg-indigo-600 text-white rounded">Refresh</button>
      </div>

      {garages.length === 0 ? (
        <div className="text-sm text-gray-500">No garages found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {garages.map(g => (
            <div key={g._id} className="border rounded p-4 bg-white shadow-sm">
              <div className="font-semibold text-lg">{g.name}</div>
              <div className="text-sm text-gray-500">{g.location}</div>
              <div className="mt-2 text-sm">Services: <span className="font-medium">{g.services}</span></div>
              <div className="mt-1 text-sm">Contact: <span className="font-medium">{g.contact}</span></div>
              <div className="mt-2 text-xs text-gray-600">Availability: {g.availability ? 'Open' : 'Closed'}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminGarages;
