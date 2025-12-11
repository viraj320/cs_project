const express = require("express");
const router = express.Router();
const { createFeedback, getAllFeedback, createGarageReview, getGarageReviews, deleteFeedback, updateFeedback } = require("../controllers/feedBackController")



router.post("/", createFeedback);
// Admin: Get all feedback
router.get("/all", getAllFeedback);

// Garage-specific reviews
router.post("/garage", createGarageReview);
router.get("/garage", getGarageReviews);

// Update / Delete feedback
router.put("/:id", updateFeedback);
router.delete("/:id", deleteFeedback);

router.get("/test", (req, res) => {
  res.send("Feedback route is working!");
});

module.exports = router;