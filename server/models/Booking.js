const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    garageId: { type: mongoose.Schema.Types.ObjectId, ref: "Garage", required: false },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String },
    customerPhone: { type: String },
    service: { type: String, required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ["Pending", "Accepted", "Rejected"], default: "Pending" }
    ,
    isPartsBooking: { type: Boolean, default: false }
  },
  { timestamps: true }
);


module.exports = mongoose.model("Booking", bookingSchema);