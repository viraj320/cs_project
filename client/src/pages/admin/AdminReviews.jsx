import React, { useEffect, useState } from "react";
import API from "../../services/api";

const AdminReviews = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const { data } = await API.get("/feedback/all");
        // Only show feedbacks that do NOT have a garageId and have a feedback field (spare part feedbacks only)
        const filtered = Array.isArray(data?.data) ? data.data.filter(fb => !fb.garageId && fb.feedback && fb.feedback.trim() !== "") : [];
        setFeedbacks(filtered);
      } catch (e) {
        setFeedbacks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Spare Part Customer Reviews</h1>
      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : feedbacks.length === 0 ? (
        <div className="text-gray-500">No spare part feedback found.</div>
      ) : (
        <ul className="space-y-4">
          {feedbacks.map((fb) => (
            <li key={fb._id} className="border p-4 rounded">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{fb.rating === "Very Bad" ? "😠" : fb.rating === "Bad" ? "😟" : fb.rating === "Okay" ? "😐" : fb.rating === "Good" ? "😊" : fb.rating === "Excellent" ? "😍" : ""}</span>
                <span className="font-semibold">{fb.rating}</span>
                <span className="ml-auto text-xs text-gray-400">{new Date(fb.createdAt).toLocaleString()}</span>
              </div>
              <div className="mb-2 text-gray-700">{fb.feedback}</div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Recommend: <span className="font-bold">{fb.recommend}</span>/10</span>
                <span>Email: {fb.email}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminReviews;
