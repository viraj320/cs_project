const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController"); // Ensure this import is correct
const garageOwnerController = require("../controllers/garageOwnerController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Public Routes
router.post("/signup", authController.register);  // Customer signup
router.post("/login", authController.login);  // Login for all users
router.post("/google-login", authController.googleLogin);  // Google OAuth
router.post("/register-garage-owner", garageOwnerController.registerGarageOwner);  // Garage owner registration

// Protected Routes
router.put("/user/profile", authMiddleware, authController.updateProfile);
router.get("/user/profile", authMiddleware, authController.getProfile);
router.get("/users", authMiddleware, roleMiddleware(["admin"]), authController.getAllUsers); // Get all users for admin
router.put("/users/:id", authMiddleware, roleMiddleware(["admin"]), authController.updateUserByAdmin);

module.exports = router;
