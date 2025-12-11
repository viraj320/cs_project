import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaSearch, FaSync, FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const GarageOwnersList = () => {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filteredOwners, setFilteredOwners] = useState([]);

  // Load all garage owners
  const loadOwners = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/garage-admin/garage-owners",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setOwners(response.data || []);
      setFilteredOwners(response.data || []);
    } catch (error) {
      console.error("Failed to load garage owners:", error);
      alert("Failed to load garage owners");
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadOwners();
  }, []);

  // Filter owners based on search
  useEffect(() => {
    const searchTerm = search.toLowerCase();
    const filtered = owners.filter(
      (owner) =>
        owner.name?.toLowerCase().includes(searchTerm) ||
        owner.email?.toLowerCase().includes(searchTerm) ||
        owner.businessPhone?.includes(search) ||
        owner.businessAddress?.toLowerCase().includes(searchTerm)
    );
    setFilteredOwners(filtered);
  }, [search, owners]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Registered Garage Owners</h2>
          <p className="text-gray-600 mt-1">
            Total: <span className="font-semibold text-purple-600">{owners.length}</span> owners
          </p>
        </div>
        <button
          onClick={loadOwners}
          disabled={loading}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition disabled:bg-gray-400"
        >
          <FaSync className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <FaSearch className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, email, phone, or address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading garage owners...</p>
        </div>
      ) : filteredOwners.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-12 text-center border border-gray-200">
          <FaUser className="text-4xl text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600 text-lg">
            {search ? "No garage owners found matching your search." : "No garage owners registered yet."}
          </p>
        </div>
      ) : (
        /* Owners Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOwners.map((owner) => (
            <div key={owner._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition border border-gray-200 overflow-hidden">
              {/* Card Header */}
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-4">
                <h3 className="text-lg font-bold text-white truncate">{owner.name}</h3>
                <p className="text-purple-100 text-sm truncate">{owner.email}</p>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3">
                {/* Business Phone */}
                {owner.businessPhone && (
                  <div className="flex items-start gap-3">
                    <FaPhone className="text-purple-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">Business Phone</p>
                      <p className="text-sm font-medium text-gray-800">{owner.businessPhone}</p>
                    </div>
                  </div>
                )}

                {/* Business Address */}
                {owner.businessAddress && (
                  <div className="flex items-start gap-3">
                    <FaMapMarkerAlt className="text-purple-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">Business Address</p>
                      <p className="text-sm font-medium text-gray-800">{owner.businessAddress}</p>
                    </div>
                  </div>
                )}

                {/* Garages */}
                {owner.garage && (
                  <div className="flex items-start gap-3">
                    <FaEnvelope className="text-purple-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">Garage Name</p>
                      <p className="text-sm font-medium text-gray-800">{owner.garage}</p>
                    </div>
                  </div>
                )}

                {/* Registration Status */}
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-xs text-gray-500">Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <p className="text-sm font-medium text-green-600">Active</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer Stats */}
      {filteredOwners.length > 0 && (
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold text-purple-600">{filteredOwners.length}</span> of{" "}
            <span className="font-semibold text-purple-600">{owners.length}</span> garage owners
          </p>
        </div>
      )}
    </div>
  );
};

export default GarageOwnersList;
