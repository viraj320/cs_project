import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const FindGaragesPage = () => {
  const [garages, setGarages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/garage/list");
        setGarages(data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Filter garages based on search term
  const filteredGarages = garages.filter(
    (garage) =>
      garage.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      garage.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      garage.services.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <p className="text-center text-gray-600">Loading garages...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Find Garages</h1>
        <p className="text-gray-600 mb-6">
          Browse and book from our network of trusted garages
        </p>

        {/* Search Bar */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Search by garage name, location, or services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
          />
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Search
          </button>
        </div>
      </div>

      {/* Garages Grid */}
      {filteredGarages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGarages.map((garage) => (
            <div key={garage._id} className="border rounded-lg p-6 shadow-md hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{garage.name}</h3>
              
              <div className="space-y-2 mb-4 text-sm text-gray-600">
                <p>
                  <span className="font-medium">📍 Location:</span> {garage.location || "-"}
                </p>
                <p>
                  <span className="font-medium">📞 Contact:</span> {garage.contact || "-"}
                </p>
                <p>
                  <span className="font-medium">🔧 Services:</span> {garage.services || "-"}
                </p>
                <p>
                  <span className="font-medium">⏱️ Status:</span>{" "}
                  <span className={garage.availability ? "text-green-600" : "text-red-600"}>
                    {garage.availability ? "Available" : "Unavailable"}
                  </span>
                </p>
              </div>

              <Link
                to={`/garage/${garage._id}`}
                className="inline-block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                View Details / Book
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">
            {searchTerm ? "No garages found matching your search" : "No garages available"}
          </p>
        </div>
      )}
    </div>
  );
};

export default FindGaragesPage;
