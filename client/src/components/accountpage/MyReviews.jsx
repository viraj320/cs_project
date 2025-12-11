import React, { useEffect, useState } from 'react';
import API from '../../services/api';

const MyReviews = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ rating: "", feedback: "", recommend: "" });
  const [saving, setSaving] = useState(false);

  const ratingOptions = ["Very Bad", "Bad", "Okay", "Good", "Excellent"]; // keep aligned with schema

  // Get user email from localStorage
  const userData = (typeof window !== "undefined" && (localStorage.getItem("userData") || localStorage.getItem("user"))) || null;
  const user = userData ? JSON.parse(userData) : null;
  const email = user?.email;

  const fetchFeedbacks = async () => {
    if (!email) {
      setLoading(false);
      return;
    }
    try {
      const res = await API.get("/feedback/all");
      const allFeedbacks = res.data?.data || [];
      // Filter feedbacks by user email and exclude garage reviews
      const userFeedbacks = allFeedbacks.filter(fb => fb.email === email && !fb.garageId);
      setFeedbacks(userFeedbacks);
    } catch (err) {
      console.error("Error fetching user reviews:", err);
      setFeedbacks([]);
    }
    setLoading(false);
  };

  const deleteFeedback = async (feedbackId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) {
      return;
    }
    
    try {
      await API.delete(`/feedback/${feedbackId}`);
      // Remove from state immediately
      setFeedbacks(feedbacks.filter(fb => fb._id !== feedbackId));
      alert("Review deleted successfully!");
    } catch (err) {
      console.error("Error deleting review:", err);
      alert("Failed to delete review. Please try again.");
    }
  };

  const startEdit = (fb) => {
    setEditingId(fb._id);
    setForm({
      rating: fb.rating || "",
      feedback: fb.feedback || "",
      recommend: fb.recommend ?? "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ rating: "", feedback: "", recommend: "" });
  };

  const submitEdit = async () => {
    if (!editingId) return;
    if (!form.rating || !form.feedback || form.recommend === "") {
      alert("Please complete all fields before saving.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        rating: form.rating,
        feedback: form.feedback,
        recommend: Number(form.recommend),
        email,
      };

      const res = await API.put(`/feedback/${editingId}`, payload);
      const updated = res.data?.data || payload;

      setFeedbacks((prev) =>
        prev.map((fb) => (fb._id === editingId ? { ...fb, ...updated } : fb))
      );
      cancelEdit();
      alert("Review updated successfully!");
    } catch (err) {
      console.error("Error updating review:", err);
      alert("Failed to update review. Please try again.");
    }
    setSaving(false);
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [email]);

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">My Reviews</h2>
      {loading ? (
        <div>Loading...</div>
      ) : feedbacks.length === 0 ? (
        <div className="text-gray-500">You haven't written any reviews yet.</div>
      ) : (
        <ul className="space-y-4">
          {feedbacks.map(fb => (
            <li key={fb._id} className="border p-4 rounded relative">
              {editingId === fb._id ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{form.rating === "Very Bad" ? "😠" : form.rating === "Bad" ? "😟" : form.rating === "Okay" ? "😐" : form.rating === "Good" ? "😊" : form.rating === "Excellent" ? "😍" : ""}</span>
                    <select
                      className="border rounded px-2 py-1 text-sm"
                      value={form.rating}
                      onChange={(e) => setForm({ ...form, rating: e.target.value })}
                    >
                      <option value="">Select rating</option>
                      {ratingOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    <span className="ml-auto text-xs text-gray-400">{new Date(fb.createdAt).toLocaleString()}</span>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Your review</label>
                    <textarea
                      className="w-full border rounded px-3 py-2 text-sm"
                      rows={3}
                      value={form.feedback}
                      onChange={(e) => setForm({ ...form, feedback: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-sm text-gray-600">Recommend (1-10)</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      className="w-20 border rounded px-2 py-1 text-sm"
                      value={form.recommend}
                      onChange={(e) => setForm({ ...form, recommend: e.target.value })}
                    />
                  </div>
                  <div className="flex justify-end gap-2 text-sm">
                    <button
                      onClick={cancelEdit}
                      className="px-3 py-1 border rounded hover:bg-gray-50"
                      disabled={saving}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={submitEdit}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
                      disabled={saving}
                    >
                      {saving ? "Saving..." : "Save"}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{fb.rating === "Very Bad" ? "😠" : fb.rating === "Bad" ? "😟" : fb.rating === "Okay" ? "😐" : fb.rating === "Good" ? "😊" : fb.rating === "Excellent" ? "😍" : ""}</span>
                    <span className="font-semibold">{fb.rating}</span>
                    <span className="ml-auto text-xs text-gray-400">{new Date(fb.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="mb-2 text-gray-700">{fb.feedback}</div>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <div className="flex gap-4">
                      <span>Recommend: <span className="font-bold">{fb.recommend}</span>/10</span>
                      <span>Email: {fb.email}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(fb)}
                        className="px-3 py-1 border rounded hover:bg-gray-50 transition text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteFeedback(fb._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyReviews;
