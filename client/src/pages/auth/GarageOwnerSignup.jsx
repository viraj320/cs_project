import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const GarageOwnerSignup = () => {
  const [step, setStep] = useState(1); // Step 1: Personal Info, Step 2: Business Info
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [availableServices, setAvailableServices] = useState([]);
  const navigate = useNavigate();

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

  const [formData, setFormData] = useState({
    // Personal Info
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    businessPhone: "",

    // Business Info
    businessAddress: "",
    garageName: "",
    garageLocation: "",
    garageServices: [], // Changed to array for selected services
    garageContact: "",
  });

  // Load services from backend on component mount
  useEffect(() => {
    const loadServices = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/services");
        const activeServices = response.data.filter((s) => s.isActive !== false);
        setAvailableServices(activeServices.length > 0 ? activeServices : defaultServices);
      } catch (error) {
        console.warn("Failed to load services from backend, using defaults:", error.message);
        setAvailableServices(defaultServices);
      }
    };

    loadServices();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === "garageServices" && type === "checkbox") {
      // Handle multi-select checkboxes for services
      setFormData((prev) => ({
        ...prev,
        garageServices: checked
          ? [...prev.garageServices, value]
          : prev.garageServices.filter((s) => s !== value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setError("");
  };

  const validateStep1 = () => {
    if (!formData.name.trim()) {
      setError("Full name is required");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Invalid email format");
      return false;
    }
    if (!formData.password) {
      setError("Password is required");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (!formData.businessPhone.trim()) {
      setError("Business phone is required");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.businessAddress.trim()) {
      setError("Business address is required");
      return false;
    }
    if (!formData.garageName.trim()) {
      setError("Garage name is required");
      return false;
    }
    if (!formData.garageLocation.trim()) {
      setError("Garage location is required");
      return false;
    }
    if (!formData.garageServices || formData.garageServices.length === 0) {
      setError("Please select at least one service");
      return false;
    }
    if (!formData.garageContact.trim()) {
      setError("Garage contact is required");
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep2()) {
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/auth/register-garage-owner", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        businessPhone: formData.businessPhone,
        businessAddress: formData.businessAddress,
        garageName: formData.garageName,
        garageLocation: formData.garageLocation,
        garageServices: formData.garageServices.join(", "), // Convert array to comma-separated string
        garageContact: formData.garageContact,
      });

      // If server returned a token and user, persist them so owner is logged in
      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
      }
      if (response.data?.user) {
        localStorage.setItem("userData", JSON.stringify(response.data.user));
      }
      // set role and garageId for quick access
      localStorage.setItem("userRole", "garage_owner");
      if (response.data?.garage?._id) {
        localStorage.setItem("garageId", response.data.garage._id);
      }

      // Redirect into the garage owner portal so they can edit details immediately
      navigate("/garage-portal/services");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-blue-900 mb-2 text-center">Garage Owner Sign Up</h1>
        <p className="text-gray-600 text-center mb-6">Register your garage business</p>

        {/* Progress indicator */}
        <div className="flex gap-2 mb-6">
          <div
            className={`flex-1 h-2 rounded-full ${step === 1 ? "bg-blue-600" : "bg-gray-300"}`}
          />
          <div
            className={`flex-1 h-2 rounded-full ${step === 2 ? "bg-blue-600" : "bg-gray-300"}`}
          />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Step 1: Personal Information */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Phone
                </label>
                <input
                  type="tel"
                  name="businessPhone"
                  value={formData.businessPhone}
                  onChange={handleChange}
                  placeholder="Your business phone number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                />
              </div>

              <button
                type="button"
                onClick={handleNextStep}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition mt-6"
              >
                Next: Business Information →
              </button>
            </div>
          )}

          {/* Step 2: Business Information */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Business Information</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Address
                </label>
                <input
                  type="text"
                  name="businessAddress"
                  value={formData.businessAddress}
                  onChange={handleChange}
                  placeholder="Full business address"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Garage Name</label>
                <input
                  type="text"
                  name="garageName"
                  value={formData.garageName}
                  onChange={handleChange}
                  placeholder="Your garage name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Garage Location
                </label>
                <input
                  type="text"
                  name="garageLocation"
                  value={formData.garageLocation}
                  onChange={handleChange}
                  placeholder="Location or area"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Services Offered (Select at least one)
                </label>
                <div className="grid grid-cols-2 gap-2 p-3 border border-gray-300 rounded-lg bg-gray-50">
                  {availableServices.length > 0 ? (
                    availableServices.map((service) => (
                      <label key={service._id || service} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          name="garageServices"
                          value={service.name || service}
                          checked={formData.garageServices.includes(service.name || service)}
                          onChange={handleChange}
                          className="w-4 h-4 rounded cursor-pointer"
                        />
                        <span className="text-sm text-gray-700">{service.name || service}</span>
                      </label>
                    ))
                  ) : (
                    <p className="text-sm text-gray-600">Loading services...</p>
                  )}
                </div>
                {formData.garageServices.length > 0 && (
                  <p className="text-xs text-gray-600 mt-2">
                    Selected: {formData.garageServices.join(", ")}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Garage Contact
                </label>
                <input
                  type="tel"
                  name="garageContact"
                  value={formData.garageContact}
                  onChange={handleChange}
                  placeholder="Garage contact number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-blue-400"
                >
                  {loading ? "Registering..." : "Complete Registration"}
                </button>
              </div>
            </div>
          )}
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline font-semibold">
            Login
          </Link>
        </p>

        <p className="text-center text-sm text-gray-600 mt-2">
          Customer?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline font-semibold">
            Sign up as customer
          </Link>
        </p>
      </div>
    </div>
  );
};

export default GarageOwnerSignup;
