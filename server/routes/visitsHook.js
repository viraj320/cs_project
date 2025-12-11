const Router = require("express");
const getVisits = require("../controllers/bookingController");
const router = Router();

router.get("/", bookingController.getVisits);  // /api/garage/visits
module.exports = router;
