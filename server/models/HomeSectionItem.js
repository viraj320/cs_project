const mongoose = require("mongoose");

const homeSectionItemSchema = new mongoose.Schema(
  {
    section: {
      type: String,
      enum: ["flash", "new", "best"],
      required: true,
    },
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, trim: true },
    description: { type: String, trim: true },
    price: { type: Number, default: 0 },
    quantity: { type: Number, default: 0 },
    image: { type: String, trim: true },
    buttonText: { type: String, trim: true, default: "Shop Now" },
    bgColor: { type: String, trim: true, default: "bg-gray-800" },
    product: { type: Object },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HomeSectionItem", homeSectionItemSchema);
