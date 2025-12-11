const mongoose = require("mongoose");

const paymentTransactionSchema = new mongoose.Schema(
  {
    // Transaction Reference
    transactionId: {
      type: String,
      unique: true,
      required: true,
      default: () => `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    },

    // Order Reference
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
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

    // Payment Method
    paymentMethod: {
      type: String,
      enum: ["card", "cod", "paypal"],
      required: true,
    },

    // Card Details (for card payments - dummy data)
    cardDetails: {
      lastFourDigits: String,
      cardholderName: String,
      expiryMonth: String,
      expiryYear: String,
      cardType: String, // "visa", "mastercard", etc.
      // Full card number is NOT stored in production - only last 4 digits
    },

    // Amount
    amount: {
      type: Number,
      required: true,
    },

    // Payment Status
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "cancelled", "refunded"],
      default: "pending",
    },

    // Response from Payment Gateway (if applicable)
    gatewayResponse: {
      statusCode: String,
      message: String,
      referenceNumber: String,
    },

    // Error Details (if payment fails)
    errorDetails: {
      code: String,
      message: String,
    },

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
    },
    processedAt: Date,
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PaymentTransaction", paymentTransactionSchema);
