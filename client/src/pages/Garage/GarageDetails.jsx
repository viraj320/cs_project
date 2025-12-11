import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const GarageDetails = () => {
  const { id } = useParams();
  const [garage, setGarage] = useState(null);
  const [form, setForm] = useState({ customerName: "", service: "", date: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [services, setServices] = useState([]);

  // Default services (fallback if API fails)
  const defaultServices = [
    "Oil Change",
    "Brakes",
    "Engine Repair",
    "Transmission Repair",
    "Tire Repair & Replacement",
    "Battery Replacement",
    "Spark Plugs",
    "Air Filter Replacement",
    "Suspension Work",
    "Electrical Repair",
    "Cooling System Repair",
    "Fuel System Service",
  ];

  // Load garage details and services
  useEffect(() => {
    (async () => {
      try {
        const garageRes = await axios.get(`http://localhost:5000/api/garage/${id}`);
        setGarage(garageRes.data);

        // Fetch services from backend
        try {
          const servicesRes = await axios.get("http://localhost:5000/api/services");
          const activeServices = servicesRes.data.filter((s) => s.isActive !== false);
          setServices(activeServices.length > 0 ? activeServices : defaultServices);
        } catch (serviceError) {
          console.warn("Failed to load services from backend, using defaults:", serviceError.message);
          setServices(defaultServices);
        }
      } catch (e) {
        console.error("GET /api/garage/:id error:", e?.response?.status, e?.response?.data || e.message);
        alert("Failed to load garage details");
        setServices(defaultServices);
      } finally {
        setLoading(false);
      }
    })();

    // If user is logged in, prefill name
    try {
      const userData = localStorage.getItem("userData");
      if (userData) {
        const u = JSON.parse(userData);
        setForm((p) => ({ ...p, customerName: u.name || p.customerName }));
      }
    } catch (err) {
      // ignore
    }
  }, [id]);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleBook = async (e) => {
    e.preventDefault();
    if (!form.customerName || !form.service || !form.date) {
      return alert("Please fill all fields");
    }
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // If not logged in, include customerName/customerEmail in body; if logged in, server will infer customerId from token
      const body = {
        garageId: id,
        customerName: form.customerName,
        service: form.service,
        date: form.date,
      };

      await axios.post("http://localhost:5000/api/garage/bookings", body, { headers });
      alert("Booking request sent!");
      setForm({ customerName: "", service: "", date: "" });
    } catch (e) {
      console.error("POST /api/garage/bookings error:", e?.response?.status, e?.response?.data || e.message);
      alert("Booking failed, try again");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!garage) return <p>Garage not found</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">{garage.name}</h1>
      <p className="text-gray-600 mb-1">Location: {garage.location || "-"}</p>
      <p className="text-gray-600 mb-1">Contact: {garage.contact || "-"}</p>
      <p className="text-gray-600 mb-4">Services: {garage.services || "-"}</p>

      <h2 className="text-xl font-semibold mb-3">Book this Garage</h2>
      <form onSubmit={handleBook} className="space-y-3 max-w-md">
        <input
          className="p-2 border w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
          name="customerName"
          placeholder="Your Name"
          value={form.customerName}
          onChange={handleChange}
          required
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Service</label>
          <select
            name="service"
            value={form.service}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          >
            <option value="">-- Choose a Service --</option>
            {services.map((svc) => (
              <option key={svc._id || svc} value={svc.name || svc}>
                {svc.name || svc}
              </option>
            ))}
          </select>
        </div>

        <input
          className="p-2 border w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
        />
        
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          disabled={saving}
        >
          {saving ? "Sending..." : "Send Booking Request"}
        </button>
      </form>
    </div>
  );
};

export default GarageDetails;