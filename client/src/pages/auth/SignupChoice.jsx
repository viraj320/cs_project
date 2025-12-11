import React from "react";
import { Link } from "react-router-dom";
import { FaUser, FaTools } from "react-icons/fa";

const SignupChoice = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Welcome</h1>
          <p className="text-xl text-blue-100">Choose how you want to join our platform</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Customer Signup */}
          <Link to="/signup">
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-2xl transition cursor-pointer h-full flex flex-col justify-between">
              <div>
                <div className="flex justify-center mb-4">
                  <FaUser className="text-5xl text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
                  Customer Sign Up
                </h2>
                <p className="text-gray-600 text-center mb-6">
                  Browse and book garage services, purchase spare parts, and access emergency assistance.
                </p>
              </div>
              <div className="text-center">
                <ul className="text-sm text-gray-600 space-y-2 mb-6">
                  <li>✓ Search and book garages</li>
                  <li>✓ Buy spare parts</li>
                  <li>✓ Emergency assistance</li>
                  <li>✓ View order history</li>
                </ul>
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                  Sign Up as Customer
                </button>
              </div>
            </div>
          </Link>

          {/* Garage Owner Signup */}
          <Link to="/register-garage-owner">
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-2xl transition cursor-pointer h-full flex flex-col justify-between border-2 border-blue-600">
              <div>
                <div className="flex justify-center mb-4">
                  <FaTools className="text-5xl text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
                  Garage Owner Sign Up
                </h2>
                <p className="text-gray-600 text-center mb-6">
                  Register your garage, manage bookings, track analytics, and grow your business.
                </p>
              </div>
              <div className="text-center">
                <ul className="text-sm text-gray-600 space-y-2 mb-6">
                  <li>✓ Register your garage</li>
                  <li>✓ Manage bookings</li>
                  <li>✓ Track analytics</li>
                  <li>✓ Manage team admins</li>
                </ul>
                <button className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition">
                  Register Garage
                </button>
              </div>
              <div className="text-center mt-4 text-xs text-green-600 font-semibold">
                ★ New feature
              </div>
            </div>
          </Link>
        </div>

        <div className="text-center mt-8">
          <p className="text-white">
            Already have an account?{" "}
            <Link to="/login" className="underline font-semibold hover:text-blue-100">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupChoice;
