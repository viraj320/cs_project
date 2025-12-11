const Garage = require("../models/Garage");
const User = require("../models/User");

// Get all garages where user is an admin
exports.getManagedGarages = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user || user.role !== "garage_admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const garages = await Garage.find({ admins: userId }).populate("ownerId", "name email");
    res.json(garages || []);
  } catch (err) {
    console.error("Error fetching managed garages:", err);
    res.status(500).json({ message: "Failed to fetch garages" });
  }
};

// Get bookings for a garage (admin only)
exports.getGarageBookings = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { garageId } = req.params;

    // Verify admin access to this garage
    const garage = await Garage.findById(garageId);
    if (!garage || !garage.admins.includes(userId)) {
      return res.status(403).json({ message: "Unauthorized: You are not an admin for this garage" });
    }

    // Import booking controller for this functionality
    const bookingController = require("./bookingController");
    // You'll need to implement this in bookingController or fetch directly

    const Booking = require("../models/Booking");
    const bookings = await Booking.find({ garageId }).sort({ createdAt: -1 });

    res.json(bookings || []);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

// Update booking status (admin only)
exports.updateBookingStatus = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { garageId, bookingId } = req.params;
    const { status } = req.body;

    // Verify admin access
    const garage = await Garage.findById(garageId);
    if (!garage || !garage.admins.includes(userId)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const Booking = require("../models/Booking");
    const booking = await Booking.findByIdAndUpdate(bookingId, { status }, { new: true });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(booking);
  } catch (err) {
    console.error("Error updating booking:", err);
    res.status(500).json({ message: "Failed to update booking" });
  }
};

// Get reviews for a garage (admin only)
exports.getGarageReviews = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { garageId } = req.params;

    // Verify admin access
    const garage = await Garage.findById(garageId);
    if (!garage || !garage.admins.includes(userId)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const Review = require("../models/Review");
    const reviews = await Review.find({ garageId }).sort({ createdAt: -1 });

    res.json(reviews || []);
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};

// Get visit analytics for a garage (admin only)
exports.getGarageVisits = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { garageId } = req.params;

    // Verify admin access
    const garage = await Garage.findById(garageId);
    if (!garage || !garage.admins.includes(userId)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const Visit = require("../models/Visit");
    const visits = await Visit.find({ garageId }).sort({ date: -1 });

    res.json(visits || []);
  } catch (err) {
    console.error("Error fetching visits:", err);
    res.status(500).json({ message: "Failed to fetch visits" });
  }
};

// Get all registered garage owners (admin only)
exports.getAllGarageOwners = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user || user.role !== "garage_admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Fetch all users with role "garage_owner"
    const owners = await User.find({ role: "garage_owner" }).select(
      "name email businessPhone businessAddress createdAt"
    );

    // Enrich with garage information
    const enrichedOwners = await Promise.all(
      owners.map(async (owner) => {
        const garage = await Garage.findOne({ ownerId: owner._id });
        return {
          _id: owner._id,
          name: owner.name,
          email: owner.email,
          businessPhone: owner.businessPhone,
          businessAddress: owner.businessAddress,
          garage: garage?.name || "No garage registered",
          createdAt: owner.createdAt,
        };
      })
    );

    res.json(enrichedOwners || []);
  } catch (err) {
    console.error("Error fetching garage owners:", err);
    res.status(500).json({ message: "Failed to fetch garage owners" });
  }
};

// Get all garages in the system (admin only)
exports.getAllGarages = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user || user.role !== "garage_admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Fetch all garages with owner information
    const garages = await Garage.find()
      .populate("ownerId", "name email")
      .sort({ createdAt: -1 });

    // Format response
    const formattedGarages = garages.map((garage) => ({
      _id: garage._id,
      name: garage.name,
      location: garage.location,
      contact: garage.contact,
      services: garage.services || "-",
      ownerName: garage.ownerId?.name || "Unknown",
      ownerEmail: garage.ownerId?.email || "Unknown",
      createdAt: garage.createdAt,
    }));

    res.json(formattedGarages || []);
  } catch (err) {
    console.error("Error fetching all garages:", err);
    res.status(500).json({ message: "Failed to fetch garages" });
  }
};
