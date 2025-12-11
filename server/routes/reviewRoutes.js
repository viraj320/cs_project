const Router = require("express");
const { getReviews, createReview } = require("../controllers/reviewController");

const router = Router();

router.get("/", getReviews);   // list reviews (optionally by garageId)
router.get("/list", getReviews);   // alias for admin dashboard
router.post("/", createReview);// optional: add review for testing

module.exports = router;