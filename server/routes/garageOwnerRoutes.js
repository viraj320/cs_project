const express = require("express");
const router = express.Router();
const garageOwnerController = require("../controllers/garageOwnerController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// All routes require authentication
router.use(authMiddleware);

// ===== GARAGE OWNER ROUTES =====
// Register garage owner (public, but creates garage owner)
router.post("/register", garageOwnerController.registerGarageOwner);

// Get dashboard stats
router.get(
  "/dashboard-stats",
  roleMiddleware(["garage_owner"]),
  garageOwnerController.getOwnerDashboardStats
);

// Get all owned garages
router.get(
  "/garages",
  roleMiddleware(["garage_owner"]),
  garageOwnerController.getOwnedGarages
);

// Create new garage
router.post(
  "/garage",
  roleMiddleware(["garage_owner"]),
  garageOwnerController.createGarage
);

// Update garage
router.put(
  "/garage/:garageId",
  roleMiddleware(["garage_owner"]),
  garageOwnerController.updateGarage
);

// Delete garage
router.delete(
  "/garage/:garageId",
  roleMiddleware(["garage_owner"]),
  garageOwnerController.deleteGarage
);

// Get garage admins
router.get(
  "/garage/:garageId/admins",
  roleMiddleware(["garage_owner"]),
  garageOwnerController.getGarageAdmins
);

// Invite garage admin
router.post(
  "/garage/:garageId/invite-admin",
  roleMiddleware(["garage_owner"]),
  garageOwnerController.inviteGarageAdmin
);

// Remove garage admin
router.delete(
  "/garage/:garageId/admins/:adminId",
  roleMiddleware(["garage_owner"]),
  garageOwnerController.removeGarageAdmin
);

module.exports = router;
