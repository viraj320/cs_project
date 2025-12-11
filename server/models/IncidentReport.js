const mongoose = require('mongoose');

const incidentReportSchema = new mongoose.Schema({
  location: { type: String, required: true },
  type: { type: String, required: true },
  description: { type: String },
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  status: { type: String, enum: ['Pending', 'In Progress', 'Resolved'], default: 'Pending' },
}, { timestamps: true });

module.exports = mongoose.model('IncidentReport', incidentReportSchema);
