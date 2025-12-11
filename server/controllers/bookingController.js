const Booking = require("../models/Booking.js");
const mongoose = require("mongoose");

// GET /api/garage/bookings?garageId=... or ?customerId=...
exports.getBookings = async (req, res) => {
  try {
    const { garageId, customerId } = req.query;
    const q = {};
    if (garageId) q.garageId = garageId;
    if (customerId) q.customerId = customerId;
    
    const items = await Booking.find(q)
      .populate("customerId", "name email phone")
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// PUT /api/garage/bookings/:id  {status: "Accepted"|"Rejected"|"Pending"}
exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await Booking.findByIdAndUpdate(id, { status }, { new: true });
    if (!updated) return res.status(404).json({ message: "Booking not found" });
    res.json(updated);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

// (Optional) seed/create booking quickly for testing
exports.createBooking = async (req, res) => {
  try {
    const { customerId, customerName, customerEmail, customerPhone, service, garageId, date, isPartsBooking } = req.body;
    
    if (!customerId) {
      return res.status(400).json({ message: "customerId is required" });
    }

    const created = await Booking.create({
      customerId,
      customerName,
      customerEmail,
      customerPhone,
      service: service || "Booking",
      garageId: garageId || undefined,
      date: date ? new Date(date) : new Date(),
      isPartsBooking: Boolean(isPartsBooking),
    });
    res.status(201).json(created);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

// GET /api/garage/visits?garageId=...&range=30
// returns [{ date: '2025-08-01', count: 3 }, ...]
exports.getVisits = async (req, res) => {
  try {
    const { garageId, range = 30 } = req.query;
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - Number(range));

    const match = {
      createdAt: { $gte: fromDate }
    };
    if (garageId) match.garageId = new mongoose.Types.ObjectId(garageId);

    const agg = await Booking.aggregate([
      { $match: match },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const data = agg.map(a => ({ date: a._id, count: a.count }));
    res.json(data);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
