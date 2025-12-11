import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const emojiMap = {
  "Very Bad": "😠",
  "Bad": "😟",
  "Okay": "😐",
  "Good": "😊",
  "Excellent": "😍",
};

const FindGaragesPage = () => {
  const [garages, setGarages] = useState([]);
  const [selectedGarage, setSelectedGarage] = useState("");
  const [rating, setRating] = useState("");
  const [review, setReview] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

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

  // Fetch reviews for selected garage
  useEffect(() => {
    if (!selectedGarage) {
      setReviews([]);
      return;
    }
    setReviewLoading(true);
    axios
      .get("http://localhost:5000/api/feedback/garage", { params: { garageId: selectedGarage } })
      .then((res) => setReviews(res.data?.data || []))
      .catch(() => setReviews([]))
      .finally(() => setReviewLoading(false));
  }, [selectedGarage, successMsg]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    if (!selectedGarage || !rating || !review || !email) {
      setErrorMsg("Please fill all fields");
      return;
    }
    setSubmitting(true);
    try {
      await axios.post("http://localhost:5000/api/reviews", {
        garageId: selectedGarage,
        rating,
        comment: review,
        customerName: email, // or use a real name if available
      });
      setSuccessMsg("Review submitted!");
      setRating("");
      setReview("");
      setEmail("");
    } catch (err) {
      setErrorMsg("Failed to submit review");
    }
    setSubmitting(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Find Garages</h1>
      <p className="text-gray-600 mb-6">Browse and book from our network of trusted garages</p>

      {/* Garages Grid */}
      {loading ? (
        <div className="text-center text-gray-600">Loading garages...</div>
      ) : garages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {garages.map((garage) => (
            <div key={garage._id} className="border rounded-lg p-6 shadow-md hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{garage.name}</h3>
              <div className="space-y-2 mb-4 text-sm text-gray-600">
                <p><span className="font-medium">📍 Location:</span> {garage.location || "-"}</p>
                <p><span className="font-medium">📞 Contact:</span> {garage.contact || "-"}</p>
                <p><span className="font-medium">🔧 Services:</span> {garage.services || "-"}</p>
                <p><span className="font-medium">⏱️ Status:</span> <span className={garage.availability ? "text-green-600" : "text-red-600"}>{garage.availability ? "Available" : "Unavailable"}</span></p>
              </div>
              <Link to={`/garage/${garage._id}`} className="inline-block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition font-medium">View Details / Book</Link>
              <button
                className="mt-3 w-full bg-gray-100 text-blue-700 py-2 rounded-lg border hover:bg-blue-50 transition font-medium"
                onClick={() => { setSelectedGarage(garage._id); setShowReviewForm(true); }}
              >
                Leave a Review
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">No garages available</p>
        </div>
      )}

      {/* Review Section (collapsible/modal style) */}
      {showReviewForm && selectedGarage && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md relative">
            <button
              onClick={() => setShowReviewForm(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-3">Leave a Review for {garages.find(g => g._id === selectedGarage)?.name}</h2>
            <form
              onSubmit={async (e) => {
                await handleReviewSubmit(e);
                if (!errorMsg) setShowReviewForm(false);
              }}
              className="space-y-3"
            >
              <div>
                <label className="block font-semibold mb-1">Rating</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">-- Select Rating --</option>
                  {Object.entries(emojiMap).map(([label, emoji]) => (
                    <option key={label} value={label}>{emoji} {label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1">Review</label>
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  className="w-full p-2 border rounded"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              {errorMsg && <div className="text-red-600 text-sm">{errorMsg}</div>}
              {successMsg && <div className="text-green-600 text-sm">{successMsg}</div>}
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>

            {/* Show reviews for this garage */}
            <div className="mt-6">
              <h3 className="text-lg font-bold mb-2">Reviews for {garages.find(g => g._id === selectedGarage)?.name}</h3>
              {reviewLoading ? (
                <div>Loading reviews...</div>
              ) : reviews.length === 0 ? (
                <div className="text-gray-500">No reviews yet.</div>
              ) : (
                <ul className="space-y-3">
                  {reviews.map(fb => (
                    <li key={fb._id} className="border p-3 rounded">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">{emojiMap[fb.rating] || ""}</span>
                        <span className="font-semibold">{fb.rating}</span>
                        <span className="ml-auto text-xs text-gray-400">{new Date(fb.createdAt).toLocaleString()}</span>
                      </div>
                      <div className="mb-1 text-gray-700">{fb.feedback}</div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Email: {fb.email}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindGaragesPage;