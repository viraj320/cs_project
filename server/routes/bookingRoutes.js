const Router = require("express");
const {
  getBookings,
  updateBookingStatus,
  createBooking,
  getVisits
}=require("../controllers/bookingController");

const router = Router();

router.get("/", getBookings);           // list bookings (optionally by garageId)
router.get("/list", getBookings);       // alias for admin dashboard
router.put("/:id", updateBookingStatus);// accept/reject/pending
router.post("/", createBooking);        // optional: quick create for testing
router.get("/../visits", (_req, res) => res.status(404).end()); // safety
// expose visits at /api/garage/visits (mounted in server through booking controller)
module.exports = router;
