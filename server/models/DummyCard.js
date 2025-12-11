const mongoose = require('mongoose');

const DummyCardSchema = new mongoose.Schema(
  {
    cardNumber: {
      type: String,
      required: true,
      unique: true,
    },
    cardholderName: {
      type: String,
      required: true,
    },
    expiryMonth: {
      type: String,
      required: true,
    },
    expiryYear: {
      type: String,
      required: true,
    },
    cvv: {
      type: String,
      required: true,
    },
    cardType: {
      type: String,
      enum: ['Visa', 'Mastercard', 'Amex'],
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'declined', 'expired'],
      default: 'active',
    },
    lastUsed: {
      type: Date,
      default: null,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      default: 'Test card for development',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('DummyCard', DummyCardSchema);
