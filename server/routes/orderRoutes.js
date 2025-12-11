const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrderById,
  getOrderByOrderId,
  getCustomerOrders,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  getOrderStats,
} = require("../controllers/orderController");

// Create new order
router.post("/create", createOrder);

// Get order by MongoDB ID
router.get("/:orderId", getOrderById);

// Get order by Order Reference ID
router.get("/reference/:orderReference", getOrderByOrderId);

// Get all orders for a customer
router.get("/customer/:customerId", getCustomerOrders);

// Get all orders (admin)
router.get("/admin/all", getAllOrders);

// Get order statistics (admin)
router.get("/admin/stats", getOrderStats);

// Update order status
router.put("/:orderId/status", updateOrderStatus);

// Cancel order
router.post("/:orderId/cancel", cancelOrder);

module.exports = router;
