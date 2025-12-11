const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/serviceController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Public route - get all active services
router.get("/", serviceController.getAllServices);

// Protected routes - admin only
router.use(authMiddleware);
router.use(roleMiddleware(["garage_admin", "admin"]));

// Create service
router.post("/", serviceController.createService);

// Update service
router.put("/:id", serviceController.updateService);

// Delete service (soft delete)
router.delete("/:id", serviceController.deleteService);

// Seed default services (admin only)
router.post("/seed/default", serviceController.seedServices);

module.exports = router;
