const mongoose = require("mongoose");

const sparePartItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subcategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    price: {
      type: Number,
      default: 0,
    },
    image: {
      type: String, // URL or base64
      default: "",
    },
    imageFileName: {
      type: String,
      default: "",
    },
    quantity: {
      type: Number,
      default: 0,
    },
    specifications: {
      brand: String,
      model: String,
      compatibility: String,
      warranty: String,
    },
    productGrade: {
      type: String,
      enum: ["Standard/OE", "Premium", "Economy", "High Performance"],
      default: "Standard/OE",
    },
    fitment: {
      type: String,
      enum: ["Vehicle Specific", "Universal Fitment"],
      default: "Universal Fitment",
    },
    availability: {
      type: String,
      enum: ["In Stock", "Out of Stock"],
      default: "In Stock",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SparePartItem", sparePartItemSchema);
