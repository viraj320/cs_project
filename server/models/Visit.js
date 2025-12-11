const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema(
  {
    garage: { type: mongoose.Schema.Types.ObjectId, ref: 'Garage' },
    date: { type: String, required: true }, // YYYY-MM-DD
    count: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

visitSchema.index({ garage: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Visit', visitSchema);