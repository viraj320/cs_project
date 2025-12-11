const express = require("express");
const router = express.Router();
const garageAdminController = require("../controllers/garageAdminController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// All routes require authentication as garage_admin
router.use(authMiddleware);

// Get all managed garages
router.get(
  "/garages",
  roleMiddleware(["garage_admin"]),
  garageAdminController.getManagedGarages
);

// Get bookings for a garage
router.get(
  "/garage/:garageId/bookings",
  roleMiddleware(["garage_admin"]),
  garageAdminController.getGarageBookings
);

// Update booking status
router.put(
  "/garage/:garageId/bookings/:bookingId",
  roleMiddleware(["garage_admin"]),
  garageAdminController.updateBookingStatus
);

// Get reviews for a garage
router.get(
  "/garage/:garageId/reviews",
  roleMiddleware(["garage_admin"]),
  garageAdminController.getGarageReviews
);

// Get visit analytics
router.get(
  "/garage/:garageId/visits",
  roleMiddleware(["garage_admin"]),
  garageAdminController.getGarageVisits
);

// Get all garage owners (admin only)
router.get(
  "/garage-owners",
  roleMiddleware(["garage_admin"]),
  garageAdminController.getAllGarageOwners
);

// Get all garages (admin only)
router.get(
  "/all-garages",
  roleMiddleware(["garage_admin"]),
  garageAdminController.getAllGarages
);

module.exports = router;
