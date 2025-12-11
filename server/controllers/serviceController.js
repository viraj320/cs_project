const Service = require("../models/Service");

// Get all services
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ name: 1 });
    res.json(services);
  } catch (err) {
    console.error("Get all services error:", err);
    res.status(500).json({ message: "Failed to fetch services", error: err.message });
  }
};

// Create a new service (admin only)
exports.createService = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Service name is required" });
    }

    // Check if service already exists
    const existing = await Service.findOne({ name: { $regex: new RegExp(name, "i") } });
    if (existing) {
      return res.status(400).json({ message: "Service already exists" });
    }

    const service = await Service.create({
      name: name.trim(),
      description: description || "",
    });

    res.status(201).json(service);
  } catch (err) {
    console.error("Create service error:", err);
    res.status(500).json({ message: "Failed to create service", error: err.message });
  }
};

// Update a service (admin only)
exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, isActive } = req.body;

    if (name && !name.trim()) {
      return res.status(400).json({ message: "Service name is required" });
    }

    const service = await Service.findByIdAndUpdate(
      id,
      {
        ...(name && { name: name.trim() }),
        ...(description !== undefined && { description }),
        ...(isActive !== undefined && { isActive }),
      },
      { new: true }
    );

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json(service);
  } catch (err) {
    console.error("Update service error:", err);
    res.status(500).json({ message: "Failed to update service", error: err.message });
  }
};

// Delete a service (admin only)
exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json({ message: "Service deleted successfully", service });
  } catch (err) {
    console.error("Delete service error:", err);
    res.status(500).json({ message: "Failed to delete service", error: err.message });
  }
};

// Seed default services (run once)
exports.seedServices = async (req, res) => {
  try {
    const count = await Service.countDocuments();
    if (count > 0) {
      return res.json({ message: "Services already exist", count });
    }

    const defaultServices = [
      "Oil Change",
      "Brakes",
      "Engine Repair",
      "Transmission Repair",
      "Tire Repair & Replacement",
      "Battery Replacement",
      "Spark Plugs",
      "Air Filter Replacement",
      "Suspension Work",
      "Electrical Repair",
      "Cooling System Repair",
      "Fuel System Service",
    ];

    const services = await Service.insertMany(
      defaultServices.map((name) => ({ name }))
    );

    res.status(201).json({
      message: "Services seeded successfully",
      count: services.length,
      services,
    });
  } catch (err) {
    console.error("Seed services error:", err);
    res.status(500).json({ message: "Failed to seed services", error: err.message });
  }
};
