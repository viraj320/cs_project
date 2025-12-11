const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true, required: true },
    password: { type: String },
    role: {
      type: String,
      enum: ["customer", "garage_owner", "garage_admin", "admin"],
      default: "customer",
    },
    googleId: { type: String }, // For Google OAuth

    // Garage Owner specific fields
    businessPhone: { type: String }, // Contact number for garage business
    businessAddress: { type: String }, // Business address
    ownedGarages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Garage" }], // Garages owned by this user

    // Garage Admin specific fields
    garageOwnerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to garage owner (for admins)
    managedGarages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Garage" }], // Garages this admin manages

    // Status fields
    isVerified: { type: Boolean, default: false }, // Email verification for garage owners
    isApproved: { type: Boolean, default: true }, // Admin approval for garage owners
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
