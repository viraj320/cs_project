const mongoose =require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    garageId: { type: mongoose.Schema.Types.ObjectId, ref: "Garage", required: true },
    customerName: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, default: "" }
  },
  { timestamps: true }
);


module.exports = mongoose.model("Review", reviewSchema);