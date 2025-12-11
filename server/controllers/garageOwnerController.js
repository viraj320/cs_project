const User = require("../models/User");
const Garage = require("../models/Garage");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Booking = require("../models/Booking");
const Review = require("../models/Review");

// Register a new garage owner
exports.registerGarageOwner = async (req, res) => {
  const { name, email, password, businessPhone, businessAddress, garageName, garageLocation, garageServices, garageContact } = req.body;

  try {
    // Validate required fields
    if (!name || !email || !password || !businessPhone) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create garage owner user
    const garageOwner = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "garage_owner",
      businessPhone,
      businessAddress,
      isVerified: false, // Requires email verification
      isApproved: true, // Admin can set to false if approval workflow is needed
    });

    // Create garage if garageName is provided
    let garage = null;
    if (garageName) {
      garage = await Garage.create({
        name: garageName,
        location: garageLocation || "",
        services: garageServices || "",
        contact: garageContact || businessPhone,
        ownerId: garageOwner._id,
        admins: [garageOwner._id], // Owner is also an admin by default
      });

      // Update garage owner's ownedGarages
      garageOwner.ownedGarages = [garage._id];
      garageOwner.managedGarages = [garage._id];
      await garageOwner.save();
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: garageOwner._id, role: garageOwner.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const { password: pw, ...userData } = garageOwner._doc;
    res.status(201).json({
      token,
      user: userData,
      garage: garage || null,
      message: "Garage owner registered successfully. Please verify your email.",
    });
  } catch (err) {
    console.error("Garage owner registration error:", err);
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
};

// Get all garages owned by the logged-in garage owner
exports.getOwnedGarages = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId).populate("ownedGarages");
    if (!user || user.role !== "garage_owner") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.json(user.ownedGarages || []);
  } catch (err) {
    console.error("Error fetching owned garages:", err);
    res.status(500).json({ message: "Failed to fetch garages" });
  }
};

// Create a new garage for the logged-in owner
exports.createGarage = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, location, services, contact } = req.body;

    if (!name || !location || !services || !contact) {
      return res.status(400).json({ message: "All garage details are required" });
    }

    const user = await User.findById(userId);
    if (!user || user.role !== "garage_owner") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const garage = await Garage.create({
      name,
      location,
      services,
      contact,
      ownerId: userId,
      admins: [userId], // Owner is an admin
    });

    // Add to owner's ownedGarages
    user.ownedGarages.push(garage._id);
    if (!user.managedGarages) user.managedGarages = [];
    user.managedGarages.push(garage._id);
    await user.save();

    res.status(201).json(garage);
  } catch (err) {
    console.error("Error creating garage:", err);
    res.status(500).json({ message: "Failed to create garage" });
  }
};

// Update garage details (owner only)
exports.updateGarage = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { garageId } = req.params;
    const { name, location, services, contact, availability } = req.body;

    const garage = await Garage.findById(garageId);
    if (!garage) {
      return res.status(404).json({ message: "Garage not found" });
    }

    // Check if user owns this garage
    if (garage.ownerId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized: You do not own this garage" });
    }

    // Update fields
    if (name) garage.name = name;
    if (location) garage.location = location;
    if (services) garage.services = services;
    if (contact) garage.contact = contact;
    if (availability !== undefined) garage.availability = availability;

    await garage.save();
    res.json(garage);
  } catch (err) {
    console.error("Error updating garage:", err);
    res.status(500).json({ message: "Failed to update garage" });
  }
};

// Delete a garage (owner only)
exports.deleteGarage = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { garageId } = req.params;

    const garage = await Garage.findById(garageId);
    if (!garage) {
      return res.status(404).json({ message: "Garage not found" });
    }

    // Check if user owns this garage
    if (garage.ownerId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized: You do not own this garage" });
    }

    await Garage.deleteOne({ _id: garageId });

    // Remove from owner's ownedGarages
    await User.findByIdAndUpdate(userId, {
      $pull: { ownedGarages: garageId, managedGarages: garageId },
    });

    res.json({ message: "Garage deleted successfully" });
  } catch (err) {
    console.error("Error deleting garage:", err);
    res.status(500).json({ message: "Failed to delete garage" });
  }
};

// Get garage admins (owner only)
exports.getGarageAdmins = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { garageId } = req.params;

    const garage = await Garage.findById(garageId).populate("admins", "name email businessPhone");
    if (!garage) {
      return res.status(404).json({ message: "Garage not found" });
    }

    // Check ownership
    if (garage.ownerId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.json(garage.admins || []);
  } catch (err) {
    console.error("Error fetching admins:", err);
    res.status(500).json({ message: "Failed to fetch admins" });
  }
};

// Invite a garage admin (owner only) - by email
exports.inviteGarageAdmin = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { garageId } = req.params;
    const { adminEmail } = req.body;

    if (!adminEmail) {
      return res.status(400).json({ message: "Admin email is required" });
    }

    const garage = await Garage.findById(garageId);
    if (!garage) {
      return res.status(404).json({ message: "Garage not found" });
    }

    // Check ownership
    if (garage.ownerId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Find admin user by email
    const adminUser = await User.findOne({ email: adminEmail });
    if (!adminUser) {
      return res.status(404).json({ message: "User not found. They must register first." });
    }

    // Check if already an admin for this garage
    if (garage.admins.includes(adminUser._id)) {
      return res.status(400).json({ message: "User is already an admin for this garage" });
    }

    // Add to garage admins
    garage.admins.push(adminUser._id);
    await garage.save();

    // Update admin user's role and managedGarages if needed
    if (adminUser.role !== "garage_admin") {
      adminUser.role = "garage_admin";
    }
    if (!adminUser.garageOwnerId) {
      adminUser.garageOwnerId = userId;
    }
    if (!adminUser.managedGarages) adminUser.managedGarages = [];
    adminUser.managedGarages.push(garageId);
    await adminUser.save();

    res.json({ message: "Admin invited successfully", admin: adminUser });
  } catch (err) {
    console.error("Error inviting admin:", err);
    res.status(500).json({ message: "Failed to invite admin" });
  }
};

// Remove a garage admin (owner only)
exports.removeGarageAdmin = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { garageId, adminId } = req.params;

    const garage = await Garage.findById(garageId);
    if (!garage) {
      return res.status(404).json({ message: "Garage not found" });
    }

    // Check ownership
    if (garage.ownerId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Check if admin is the owner
    if (garage.ownerId.toString() === adminId) {
      return res.status(400).json({ message: "Cannot remove garage owner" });
    }

    // Remove from garage admins
    garage.admins = garage.admins.filter((id) => id.toString() !== adminId);
    await garage.save();

    // Remove garage from admin's managedGarages
    await User.findByIdAndUpdate(adminId, {
      $pull: { managedGarages: garageId },
    });

    res.json({ message: "Admin removed successfully" });
  } catch (err) {
    console.error("Error removing admin:", err);
    res.status(500).json({ message: "Failed to remove admin" });
  }
};

// Get overview stats for the owner dashboard
exports.getOwnerDashboardStats = async (req, res) => {
  try {
    const userId = req.user.userId;

    // 1. Find all garages owned by this user
    const ownedGarages = await Garage.find({ ownerId: userId }).select("_id");
    const garageIds = ownedGarages.map((g) => g._id);

    if (garageIds.length === 0) {
      return res.json({
        totalGarages: 0,
        totalBookings: 0,
        totalReviews: 0,
        recentBookings: [],
        recentReviews: [],
      });
    }

    // 2. Get aggregate counts
    const totalBookings = await Booking.countDocuments({ garageId: { $in: garageIds } });
    const totalReviews = await Review.countDocuments({ garageId: { $in: garageIds } });

    // 3. Get recent items
    const recentBookings = await Booking.find({ garageId: { $in: garageIds } })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("garageId", "name")
      .populate("customerId", "name");

    const recentReviews = await Review.find({ garageId: { $in: garageIds } })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("garageId", "name");

    res.json({
      totalGarages: garageIds.length,
      totalBookings,
      totalReviews,
      recentBookings,
      recentReviews,
    });
  } catch (err) {
    console.error("Error fetching owner dashboard stats:", err);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};
