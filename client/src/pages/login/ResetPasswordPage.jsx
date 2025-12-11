import React, { useState } from "react";
// import axios from "axios"; // Uncomment when backend is ready

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleResend = async (e) => {
    e.preventDefault();

    try {
      // Replace with your actual backend API call
      // const response = await axios.post("/api/auth/resend-reset-link", { email });

      console.log("Resend link sent to:", email); // For now, simulate success
      setMessage("Reset link resent successfully!");
    } catch (error) {
      setMessage("Failed to resend link. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Resend Link</h2>

        <form onSubmit={handleResend} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-2 rounded-md text-sm font-semibold hover:bg-gray-700 transition"
          >
            Resend
          </button>

          {message && (
            <p className="text-center text-green-500 text-sm mt-2">{message}</p>
          )}
        </form>
      </div>
    </div>
  );
}
