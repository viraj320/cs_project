const express = require("express");
const router = express.Router();
const {
  processCardPayment,
  processCODPayment,
  getPaymentTransaction,
  getAllTransactions,
  refundPayment,
} = require("../controllers/paymentController");

// Process card payment
router.post("/card", processCardPayment);

// Process COD (Cash on Delivery)
router.post("/cod", processCODPayment);

// Get payment transaction details
router.get("/:transactionId", getPaymentTransaction);

// Get all transactions (admin)
router.get("/admin/all", getAllTransactions);

// Refund payment
router.post("/refund", refundPayment);

module.exports = router;
