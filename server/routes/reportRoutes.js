const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Public: submit a report (optional authenticated reporter)
router.post('/', authMiddleware, reportController.createReport);
// Allow anonymous submissions too: accept without auth
router.post('/public', reportController.createReport);

// Admin: list and manage reports
router.get('/', authMiddleware, roleMiddleware(['admin']), reportController.getAllReports);
router.put('/:id/status', authMiddleware, roleMiddleware(['admin']), reportController.updateReportStatus);

module.exports = router;
