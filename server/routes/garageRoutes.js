const express = require('express');
const router = express.Router();
const {
  createOrUpdateGarage,
  listGarages,
  getBookings,
  createBooking,
  updateBookingStatus,
  getReviews,
  getVisits,
  getGarageById,
  updateGarageById,
} = require('../controllers/garageController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const optionalAuth = require('../middleware/optionalAuthMiddleware');

// Protected routes for garage owners/admins
router.post('/', authMiddleware, roleMiddleware(['garage_owner','garage_admin','admin']), createOrUpdateGarage);
// Update specific garage by id (owners or admins)
router.put('/:id', authMiddleware, roleMiddleware(['garage_owner','garage_admin','admin']), updateGarageById);
router.get('/list', listGarages);
router.get('/bookings', getBookings);
// Allow optional auth on bookings so logged-in customers supply token (server infers customerId)
router.post('/bookings', optionalAuth, createBooking);
router.put('/bookings/:id', updateBookingStatus);
router.get('/reviews', getReviews);
router.get('/visits', getVisits);
router.get('/:id', getGarageById);



module.exports = router;