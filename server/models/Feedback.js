const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    // Emoji rating (Very Bad, Bad, Okay, Good, Excellent)
    rating: {
      type: String,
      enum: ["Very Bad", "Bad", "Okay", "Good", "Excellent"],
      required: true,
    },

    // Written feedback
    feedback: {
      type: String,
      required: true,
      trim: true,
    },

    // Likert scale (1–10)
    recommend: {
      type: Number,
      min: 1,
      max: 10,
      required: true,
    },

    // Email
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    // User name
    name: {
      type: String,
      required: false,
      trim: true,
    },

    // Garage ID (for garage-specific reviews)
    garageId: {
      type: String,
      required: false,
    },
  },
  { timestamps: true } // Auto adds createdAt & updatedAt
);

module.exports = mongoose.model("Feedback", feedbackSchema);
