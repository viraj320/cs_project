import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaSearch,
  FaSync,
  FaTools,
  FaPhone,
  FaMapMarkerAlt,
  FaUser,
  FaStar,
} from "react-icons/fa";

const AllGaragesList = () => {
  const [garages, setGarages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filteredGarages, setFilteredGarages] = useState([]);

  // Load all garages
  const loadGarages = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/garage-admin/all-garages",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setGarages(response.data || []);
      setFilteredGarages(response.data || []);
    } catch (error) {
      console.error("Failed to load garages:", error);
      alert("Failed to load garages");
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadGarages();
  }, []);

  // Filter garages based on search
  useEffect(() => {
    const searchTerm = search.toLowerCase();
    const filtered = garages.filter(
      (garage) =>
        garage.name?.toLowerCase().includes(searchTerm) ||
        garage.location?.toLowerCase().includes(searchTerm) ||
        garage.contact?.includes(search) ||
        garage.ownerName?.toLowerCase().includes(searchTerm)
    );
    setFilteredGarages(filtered);
  }, [search, garages]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">All Garages</h2>
          <p className="text-gray-600 mt-1">
            Total: <span className="font-semibold text-purple-600">{garages.length}</span> garages
          </p>
        </div>
        <button
          onClick={loadGarages}
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
          placeholder="Search by garage name, location, owner, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading garages...</p>
        </div>
      ) : filteredGarages.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-12 text-center border border-gray-200">
          <FaTools className="text-4xl text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600 text-lg">
            {search ? "No garages found matching your search." : "No garages registered yet."}
          </p>
        </div>
      ) : (
        /* Garages Table */
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
                  <th className="px-6 py-3 text-left text-sm font-semibold">Garage Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Owner Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Location</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Contact</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Services</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredGarages.map((garage) => (
                  <tr
                    key={garage._id}
                    className="hover:bg-gray-50 transition border-l-4 border-purple-600"
                  >
                    {/* Garage Name */}
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-800">{garage.name || "-"}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          ID: {garage._id?.substring(0, 8)}...
                        </p>
                      </div>
                    </td>

                    {/* Owner Name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FaUser className="text-purple-600" />
                        <span className="text-gray-800">{garage.ownerName || "-"}</span>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-red-600 flex-shrink-0" />
                        <span className="text-gray-800">{garage.location || "-"}</span>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FaPhone className="text-green-600 flex-shrink-0" />
                        <span className="text-gray-800">{garage.contact || "-"}</span>
                      </div>
                    </td>

                    {/* Services */}
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-2">
                        <FaTools className="text-blue-600 mt-1 flex-shrink-0" />
                        <div className="text-sm">
                          {garage.services && garage.services !== "-" ? (
                            <div className="flex flex-wrap gap-1">
                              {garage.services
                                .split(",")
                                .slice(0, 2)
                                .map((service, index) => (
                                  <span
                                    key={index}
                                    className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs"
                                  >
                                    {service.trim()}
                                  </span>
                                ))}
                              {garage.services.split(",").length > 2 && (
                                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                  +{garage.services.split(",").length - 2} more
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-500">No services</span>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Footer Stats */}
      {filteredGarages.length > 0 && (
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold text-purple-600">{filteredGarages.length}</span> of{" "}
            <span className="font-semibold text-purple-600">{garages.length}</span> garages
          </p>
        </div>
      )}
    </div>
  );
};

export default AllGaragesList;
