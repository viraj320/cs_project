const IncidentReport = require('../models/IncidentReport');

exports.createReport = async (req, res) => {
  const { location, type, description } = req.body;
  const reporter = req.user?.userId || null;

  if (!location || !type) return res.status(400).json({ message: 'Location and type are required' });

  try {
    const report = await IncidentReport.create({ location, type, description, reporter });
    res.status(201).json({ message: 'Report created', report });
  } catch (err) {
    console.error('Create report error:', err);
    res.status(500).json({ message: 'Failed to create report' });
  }
};

exports.getAllReports = async (req, res) => {
  try {
    const reports = await IncidentReport.find().populate('reporter', '-password -__v').sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    console.error('Get reports error:', err);
    res.status(500).json({ message: 'Failed to fetch reports' });
  }
};

exports.updateReportStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['Pending','In Progress','Resolved'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    const report = await IncidentReport.findById(id);
    if (!report) return res.status(404).json({ message: 'Report not found' });
    report.status = status;
    await report.save();
    res.json({ message: 'Status updated', report });
  } catch (err) {
    console.error('Update status error:', err);
    res.status(500).json({ message: 'Failed to update status' });
  }
};
