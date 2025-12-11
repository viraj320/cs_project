const Review = require("../models/Review.js");

// GET /api/garage/reviews?garageId=...
exports.getReviews = async (req, res) => {
  try {
    const { garageId } = req.query;
    const q = garageId ? { garageId } : {};
    const items = await Review.find(q).sort({ createdAt: -1 });
    res.json(items);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// (Optional) POST to add a review for testing
exports.createReview = async (req, res) => {
  try {
    const created = await Review.create(req.body);
    res.status(201).json(created);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
