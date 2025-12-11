const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    // Order Reference
    orderId: {
      type: String,
      unique: true,
      required: true,
      default: () => `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    },

    // Customer Information
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    customerEmail: {
      type: String,
      required: true,
    },
    customerPhone: {
      type: String,
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },

    // Order Items
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "SparePartItem",
        },
        name: String,
        price: Number,
        quantity: {
          type: Number,
          required: true,
        },
        image: String, // Base64 or image URL
      },
    ],

    // Delivery Information
    deliveryLocation: {
      type: String,
      required: true,
      enum: ["colombo", "westernProvince", "centralProvince", "southernProvince", "northernProvince", "easternProvince", "ubProvince", "sabProvince"],
    },
    deliveryAddress: {
      firstName: String,
      lastName: String,
      address1: String,
      address2: String,
      city: String,
      zip: String,
      state: String,
      country: String,
    },

    // Pricing
    subtotal: {
      type: Number,
      required: true,
    },
    deliveryFee: {
      type: Number,
      required: true,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
    },

    // Payment Information
    paymentMethod: {
      type: String,
      enum: ["card", "cod", "paypal"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "cancelled"],
      default: "pending",
    },

    // Order Status
    orderStatus: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },

    // Notes
    orderNotes: String,

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
