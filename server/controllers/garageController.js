const mongoose = require('mongoose');
const Garage = require('../models/Garage');
const Booking = require('../models/Booking');
const User = require('../models/User');
const Review = require('../models/Review');
const Visit = require('../models/Visit');

// POST /api/garage
exports.createOrUpdateGarage = async (req, res) => {
  try {
    const { name, location, services, contact, availability } = req.body;
    if (!name) return res.status(400).json({ message: 'name is required' });
    // If user is authenticated, attach ownerId when creating
    const ownerId = req.user && req.user.userId ? req.user.userId : undefined;

    const existing = await Garage.findOne({ name });
    if (existing) {
      if (typeof location !== 'undefined') existing.location = location;
      if (typeof services !== 'undefined') existing.services = services;
      if (typeof contact !== 'undefined') existing.contact = contact;
      if (typeof availability !== 'undefined') existing.availability = availability;
      // If existing has no owner but request is from an authenticated user, set owner
      if (!existing.ownerId && ownerId) existing.ownerId = ownerId;
      const updated = await existing.save();
      return res.json(updated);
    } else {
      const payload = { name, location, services, contact, availability };
      if (ownerId) payload.ownerId = ownerId;
      const created = await Garage.create(payload);
      return res.status(201).json(created);
    }
  } catch (err) {
    console.error('createOrUpdateGarage error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/garage/:id - update by id with ownership checks
exports.updateGarageById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid garage id' });

    const garage = await Garage.findById(id);
    if (!garage) return res.status(404).json({ message: 'Garage not found' });

    const userId = req.user && req.user.userId ? req.user.userId : null;
    const userRole = req.user && req.user.role ? req.user.role : null;

    // Allow if owner or admin
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    if (garage.ownerId && garage.ownerId.toString() !== userId && userRole !== 'admin' && userRole !== 'garage_admin') {
      return res.status(403).json({ message: 'Forbidden: not owner or admin' });
    }

    const { name, location, services, contact, availability } = req.body;
    if (typeof name !== 'undefined') garage.name = name;
    if (typeof location !== 'undefined') garage.location = location;
    if (typeof services !== 'undefined') garage.services = services;
    if (typeof contact !== 'undefined') garage.contact = contact;
    if (typeof availability !== 'undefined') garage.availability = availability;

    const updated = await garage.save();
    res.json(updated);
  } catch (e) {
    console.error('updateGarageById error:', e);
    res.status(500).json({ message: 'Server error' });
  }
};

// List all garages
exports.listGarages = async (req, res) => {
  try {
    const garages = await Garage.find().sort({ createdAt: -1 });
    res.json(garages);
  } catch (err) {
    console.error('listGarages error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// CHANGE: GET /api/garage/bookings - support optional ?garageId=...
exports.getBookings = async (req, res) => {
  try {
    const { garageId } = req.query;
    const filter =
      garageId && mongoose.Types.ObjectId.isValid(garageId)
        ? { garageId }
        : {};
    const bookings = await Booking.find(filter).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error('getBookings error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/garage/bookings/:id
exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Pending', 'Accepted', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid booking id' });
    }

    const updated = await Booking.findByIdAndUpdate(id, { status }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Booking not found' });

    res.json(updated);
  } catch (err) {
    console.error('updateBookingStatus error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// CHANGE: GET /api/garage/reviews - support optional ?garageId=...
exports.getReviews = async (req, res) => {
  try {
    const { garageId } = req.query;
    const filter =
      garageId && mongoose.Types.ObjectId.isValid(garageId)
        ? { garageId }
        : {};
    const reviews = await Review.find(filter).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    console.error('getReviews error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// CHANGE: GET /api/garage/visits - support optional ?garageId=...
exports.getVisits = async (req, res) => {
  try {
    const { garageId } = req.query;
    const filter =
      garageId && mongoose.Types.ObjectId.isValid(garageId)
        ? { garageId }
        : {};
    const visits = await Visit.find(filter).sort({ date: 1 }).limit(60);
    res.json(visits.map(v => ({ date: v.date, count: v.count })));
  } catch (err) {
    console.error('getVisits error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ADD: POST /api/garage/bookings - create a booking
exports.createBooking = async (req, res) => {
  try {
    const { garageId, customerName: bodyName, customerEmail: bodyEmail, customerPhone: bodyPhone, service, date } = req.body;

    // Determine customerId: prefer authenticated user, fallback to provided customerId in body
    const customerId = (req.user && req.user.userId) || req.body.customerId;

    if (!garageId || !service || !date) {
      return res.status(400).json({ message: 'garageId, service and date are required' });
    }

    if (!customerId) {
      return res.status(400).json({ message: 'customerId is required. Please login or provide customerId in request body.' });
    }

    // validate garageId and existence
    if (!mongoose.Types.ObjectId.isValid(garageId)) {
      return res.status(400).json({ message: 'Invalid garage id' });
    }
    const garage = await Garage.findById(garageId);
    if (!garage) return res.status(404).json({ message: 'Garage not found' });

    // validate customerId and optionally fetch user info
    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({ message: 'Invalid customer id' });
    }
    const customer = await User.findById(customerId).select('name email businessPhone');
    if (!customer) return res.status(404).json({ message: 'Customer user not found' });

    const customerName = bodyName || customer.name || 'Customer';
    const customerEmail = bodyEmail || customer.email || undefined;
    const customerPhone = bodyPhone || customer.businessPhone || undefined;

    const booking = await Booking.create({
      garageId,
      customerId,
      customerName,
      customerEmail,
      customerPhone,
      service,
      date: date ? new Date(date) : new Date(),
      status: 'Pending'
    });
    res.status(201).json(booking);
  } catch (e) {
    console.error('createBooking error:', e);
    res.status(500).json({ message: 'Server error', error: e.message });
  }
};

// ADD: GET /api/garage/:id - single garage by id (with ObjectId validation)
exports.getGarageById = async (req, res) => {
  try {
    const { id } = req.params;

    // ADD: validate id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid garage id' });
    }

    const g = await Garage.findById(id);
    if (!g) return res.status(404).json({ message: 'Garage not found' });
    res.json(g);
  } catch (e) {
    console.error('getGarageById error:', e);
    res.status(500).json({ message: 'Server error' });
  }
};