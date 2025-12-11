const mongoose = require("mongoose");

const garageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    services: { type: String, required: true }, // comma-separated or free text
    contact: { type: String, required: true },
    availability: { type: Boolean, default: true },

    // Ownership fields
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to garage owner
    admins: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Array of garage admin User IDs
  },
  { timestamps: true }
);

module.exports = mongoose.model("Garage", garageSchema);