import React, { useEffect, useState } from "react";
import axios from "axios";
// CHANGE: import useOutletContext to read selected garage from Dashboard
import { useOutletContext } from "react-router-dom";

const GarageReviews = () => {
  // CHANGE: get garageId from Dashboard via Outlet context
  const outlet = useOutletContext();
  const ctxGarageId = outlet?.garageId;

  // Get initial garageId from Dashboard context OR URL OR localStorage
  // CHANGE: prioritize ctxGarageId first
  const search =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : null;
  const initialId =
    ctxGarageId ||
    (search && search.get("garageId")) ||
    localStorage.getItem("garageId") ||
    "";

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeGarageId, setActiveGarageId] = useState(initialId);
  const [inputGarageId, setInputGarageId] = useState(initialId);

  const updateUrlParam = (id) => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location);
    if (id) url.searchParams.set("garageId", id);
    else url.searchParams.delete("garageId");
    window.history.replaceState({}, "", url);
  };

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/garage/reviews", {
        params: activeGarageId ? { garageId: activeGarageId } : undefined,
      });
      setReviews(res.data || []);
    } catch (error) {
      console.error(error);
      alert("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  // CHANGE: re-fetch when activeGarageId changes
  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeGarageId]);

  // CHANGE: sync with Dashboard selection (runs when sidebar selection changes)
  useEffect(() => {
    if (ctxGarageId !== undefined) {
      const id = ctxGarageId || "";
      setInputGarageId(id);
      setActiveGarageId(id);
      if (id) localStorage.setItem("garageId", id);
      else localStorage.removeItem("garageId");
      updateUrlParam(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctxGarageId]);

  const handleApplyFilter = () => {
    const id = inputGarageId.trim();
    setActiveGarageId(id);
    if (id) localStorage.setItem("garageId", id);
    else localStorage.removeItem("garageId");
    updateUrlParam(id);
  };

  const handleClearFilter = () => {
    setInputGarageId("");
    setActiveGarageId("");
    localStorage.removeItem("garageId");
    updateUrlParam("");
  };

  const avg =
    reviews.length > 0
      ? (
          reviews.reduce((s, r) => s + (Number(r.rating) || 0), 0) /
          reviews.length
        ).toFixed(1)
      : null;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Customer Feedback & Ratings</h2>
        {avg && <span className="text-yellow-600 font-semibold">⭐ {avg}/5</span>}
      </div>

      {/* Filter by Garage ID (keeps same pattern as Bookings) */}
      <div className="mb-4 p-3 border rounded bg-gray-50">
        <label className="block text-sm font-medium mb-1">Filter by Garage ID</label>
        <div className="flex gap-2">
          <input
            className="p-2 border flex-1"
            placeholder="Enter a garageId (optional)"
            value={inputGarageId}
            onChange={(e) => setInputGarageId(e.target.value)}
          />
          <button onClick={handleApplyFilter} className="bg-blue-600 text-white px-3 py-2 rounded">
            Apply
          </button>
          <button onClick={handleClearFilter} className="bg-gray-300 px-3 py-2 rounded">
            Clear
          </button>
        </div>
        <div className="mt-2 text-sm text-gray-600">
          {activeGarageId ? (
            <>
              Showing reviews for garageId: <span className="font-mono">{activeGarageId}</span>
            </>
          ) : (
            "Showing reviews for all garages"
          )}
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className="border p-4 rounded shadow">
              <p className="font-bold">{review.customerName}</p>
              <p className="text-gray-700">"{review.comment}"</p>
              <p className="text-yellow-600 font-semibold">⭐ {review.rating} / 5</p>
            </div>
          ))}
          {reviews.length === 0 && (
            <p className="text-gray-500">No reviews {activeGarageId ? "for this garage" : "yet"}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default GarageReviews;