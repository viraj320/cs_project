const Feedback = require("../models/Feedback");


const createFeedback = async (req, res) => {
  try {
    const { rating, feedback, recommend, email, name } = req.body;

    console.log('Received feedback:', { rating, feedback, recommend, email, name });

    if (!rating || !feedback || recommend === undefined || recommend === null || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newFeedback = await Feedback.create({
      rating,
      feedback,
      recommend: Number(recommend),
      email,
      name: name || email.split('@')[0], // Use name if provided, otherwise use email prefix
    });

    res.status(201).json({
      message: "Feedback submitted successfully",
      data: newFeedback,
    });

  } catch (error) {
    console.error("Error creating feedback:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create feedback for a specific garage
const createGarageReview = async (req, res) => {
  try {
    const { rating, feedback, email, garageId } = req.body;
    if (!rating || !feedback || !email || !garageId) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newReview = await Feedback.create({
      rating,
      feedback,
      email,
      garageId,
    });
    res.status(201).json({ message: "Review submitted successfully", data: newReview });
  } catch (error) {
    console.error("Error creating garage review:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get reviews for a specific garage
const getGarageReviews = async (req, res) => {
  try {
    const { garageId } = req.query;
    if (!garageId) {
      return res.status(400).json({ message: "garageId is required" });
    }
    const reviews = await Feedback.find({ garageId }).sort({ createdAt: -1 });
    res.status(200).json({ data: reviews });
  } catch (error) {
    console.error("Error fetching garage reviews:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all feedback (for admin dashboard)
const getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.status(200).json({ data: feedbacks });
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update feedback by ID
const updateFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, feedback, recommend, name, email } = req.body;

    const existing = await Feedback.findById(id);
    if (!existing) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    // Optional: ensure the same user is editing their own feedback
    if (email && existing.email && email.toLowerCase() !== existing.email.toLowerCase()) {
      return res.status(403).json({ message: "You can only edit your own feedback" });
    }

    const updates = {};
    if (rating) updates.rating = rating;
    if (feedback) updates.feedback = feedback;
    if (recommend !== undefined && recommend !== null) updates.recommend = Number(recommend);
    if (name !== undefined) updates.name = name;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const updated = await Feedback.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ message: "Feedback updated successfully", data: updated });
  } catch (error) {
    console.error("Error updating feedback:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete feedback by ID
const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedFeedback = await Feedback.findByIdAndDelete(id);
    
    if (!deletedFeedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }
    
    res.status(200).json({ message: "Feedback deleted successfully" });
  } catch (error) {
    console.error("Error deleting feedback:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createFeedback,
  getAllFeedback,
  createGarageReview,
  getGarageReviews,
  updateFeedback,
  deleteFeedback,
}