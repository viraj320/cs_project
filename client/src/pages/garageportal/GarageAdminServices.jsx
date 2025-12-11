import React, { useEffect, useState } from "react";
import axios from "axios";
import { useOutletContext } from "react-router-dom";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";

const GarageAdminServices = () => {
  const context = useOutletContext() || {};
  const { reloadStats } = context;

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newService, setNewService] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [saving, setSaving] = useState(false);

  // Load services from backend
  const loadServices = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const { data } = await axios.get("http://localhost:5000/api/services", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setServices(data || []);
    } catch (e) {
      console.error("Failed to load services:", e);
      // Fallback to default services if endpoint doesn't exist
      setServices([
        { _id: "1", name: "Oil Change" },
        { _id: "2", name: "Brakes" },
        { _id: "3", name: "Engine Repair" },
        { _id: "4", name: "Transmission Repair" },
        { _id: "5", name: "Tire Repair & Replacement" },
        { _id: "6", name: "Battery Replacement" },
        { _id: "7", name: "Spark Plugs" },
        { _id: "8", name: "Air Filter Replacement" },
        { _id: "9", name: "Suspension Work" },
        { _id: "10", name: "Electrical Repair" },
        { _id: "11", name: "Cooling System Repair" },
        { _id: "12", name: "Fuel System Service" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddService = async () => {
    if (!newService.trim()) {
      alert("Please enter a service name");
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/api/services",
        { name: newService },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setServices([...services, response.data]);
      setNewService("");
      if (reloadStats) reloadStats();
    } catch (e) {
      console.error("Failed to add service:", e);
      alert("Failed to add service. Check console for details.");
    } finally {
      setSaving(false);
    }
  };

  const handleEditService = async (id, name) => {
    if (!editValue.trim()) {
      alert("Please enter a service name");
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/services/${id}`,
        { name: editValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setServices(services.map((s) => (s._id === id ? { ...s, name: editValue } : s)));
      setEditingId(null);
      setEditValue("");
      if (reloadStats) reloadStats();
    } catch (e) {
      console.error("Failed to update service:", e);
      alert("Failed to update service. Check console for details.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) {
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:5000/api/services/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setServices(services.filter((s) => s._id !== id));
      if (reloadStats) reloadStats();
    } catch (e) {
      console.error("Failed to delete service:", e);
      alert("Failed to delete service. Check console for details.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-600">Loading services...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Manage Services</h2>
      <p className="text-gray-600 mb-6">
        Add, edit, and manage available services that garage owners can select during registration.
      </p>

      {/* Add New Service */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-semibold mb-4">Add New Service</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={newService}
            onChange={(e) => setNewService(e.target.value)}
            placeholder="Enter service name (e.g., Wheel Alignment)"
            className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
            onKeyPress={(e) => e.key === "Enter" && handleAddService()}
            disabled={saving}
          />
          <button
            onClick={handleAddService}
            disabled={saving}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded flex items-center gap-2 transition disabled:bg-purple-400"
          >
            <FaPlus /> Add
          </button>
        </div>
      </div>

      {/* Services List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Service Name</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.length === 0 ? (
              <tr>
                <td colSpan="2" className="px-6 py-4 text-center text-gray-500">
                  No services found. Add one to get started.
                </td>
              </tr>
            ) : (
              services.map((service) => (
                <tr key={service._id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    {editingId === service._id ? (
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
                        autoFocus
                      />
                    ) : (
                      <span className="text-gray-800">{service.name}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {editingId === service._id ? (
                      <>
                        <button
                          onClick={() => handleEditService(service._id, editValue)}
                          disabled={saving}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition disabled:bg-green-400"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null);
                            setEditValue("");
                          }}
                          className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded text-sm transition"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditingId(service._id);
                            setEditValue(service.name);
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1 inline-flex transition"
                        >
                          <FaEdit /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteService(service._id)}
                          disabled={saving}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1 inline-flex transition disabled:bg-red-400"
                        >
                          <FaTrash /> Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Services added here will be available for garage owners to select during registration
          and for customers to choose when booking appointments.
        </p>
      </div>
    </div>
  );
};

export default GarageAdminServices;
