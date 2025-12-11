import React from "react";
import { Routes, Route } from "react-router-dom";
import GarageOwnerDashboard from "../pages/garageportal/GarageOwnerDashboard";
import GarageAdminDashboard from "../pages/garageportal/GarageAdminDashboard";
import GarageAdminOverview from "../pages/garageportal/GarageAdminOverview";
import GarageOwnerOverview from "../pages/garageportal/GarageOwnerOverview";
import GarageAdminServices from "../pages/garageportal/GarageAdminServices";
import AdminBookings from "../pages/garageportal/AdminBookings";
import GarageOwnersList from "../pages/garageportal/GarageOwnersList";
import AllGaragesList from "../pages/garageportal/AllGaragesList";
import GarageServices from "../pages/Garage/GarageServices";
import GarageBookings from "../pages/Garage/GarageBookings";
import GarageReviews from "../pages/Garage/GarageReviews";
import GarageVisits from "../pages/Garage/GarageVisits";

const AdminReviews = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-4">All Reviews</h2>
    <p className="text-gray-600">Global reviews list coming soon...</p>
  </div>
);

const AdminAnalytics = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-4">Analytics</h2>
    <p className="text-gray-600">Analytics dashboard coming soon...</p>
  </div>
);

const AdminManagement = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-4">Manage Team Admins</h2>
    <p className="text-gray-600">Admin management features coming soon...</p>
  </div>
);

const GaragePortalRoutes = () => {
  const userRole = typeof window !== "undefined" ? localStorage.getItem("userRole") : null;

  return (
    <Routes>
      {/* Garage Owner Routes */}
      {userRole === "garage_owner" && (
        <Route path="/" element={<GarageOwnerDashboard />}>
          <Route path="overview" element={<GarageOwnerOverview />} />
          <Route path="services" element={<GarageServices />} />
          <Route path="bookings" element={<GarageBookings />} />
          <Route path="reviews" element={<GarageReviews />} />
          <Route path="visits" element={<GarageVisits />} />
          <Route path="admins" element={<AdminManagement />} />
          <Route index element={<GarageOwnerOverview />} />
        </Route>
      )}

      {/* Garage Admin Routes */}
      {userRole === "garage_admin" && (
        <Route path="/" element={<GarageAdminDashboard />}>
          <Route path="overview" element={<GarageAdminOverview />} />
          <Route path="garage-owners" element={<GarageOwnersList />} />
          <Route path="garages" element={<AllGaragesList />} />
          <Route path="services" element={<GarageAdminServices />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route index element={<GarageAdminOverview />} />
        </Route>
      )}
    </Routes>
  );
};

export default GaragePortalRoutes;
