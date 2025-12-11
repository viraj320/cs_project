const Order = require("../models/Order");
const SparePartItem = require("../models/SparePartItem");
const User = require("../models/User");

// Create New Order
const createOrder = async (req, res) => {
  try {
    const {
      customerId,
      customerEmail,
      customerPhone,
      customerName,
      items,
      deliveryLocation,
      deliveryAddress,
      subtotal,
      deliveryFee,
      total,
      paymentMethod,
      orderNotes,
    } = req.body;

    // Validate required fields
    if (!customerEmail || !customerName || !items || items.length === 0) {
      return res.status(400).json({
        message: "Missing required fields: customerEmail, customerName, items",
      });
    }

    // Validate items have required properties
    const validItems = items.every((item) => item.name && item.price && item.quantity);
    if (!validItems) {
      return res.status(400).json({
        message: "Invalid item data. Each item must have name, price, and quantity",
      });
    }

    // Create new order
    const newOrder = new Order({
      customerId: customerId || null,
      customerEmail: customerEmail,
      customerPhone: customerPhone,
      customerName: customerName,
      items: items,
      deliveryLocation: deliveryLocation || "colombo",
      deliveryAddress: deliveryAddress,
      subtotal: subtotal,
      deliveryFee: deliveryFee,
      total: total,
      paymentMethod: paymentMethod,
      orderNotes: orderNotes,
      paymentStatus: "pending",
      orderStatus: "pending",
    });

    await newOrder.save();

    res.status(201).json({
      message: "Order created successfully",
      success: true,
      order: newOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      message: "Error creating order",
      error: error.message,
    });
  }
};

// Get Order by ID
const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order: order,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({
      message: "Error fetching order",
      error: error.message,
    });
  }
};

// Get Order by Order Reference ID
const getOrderByOrderId = async (req, res) => {
  try {
    const { orderReference } = req.params;

    const order = await Order.findOne({ orderId: orderReference });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order: order,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({
      message: "Error fetching order",
      error: error.message,
    });
  }
};

// Get All Orders for Customer
const getCustomerOrders = async (req, res) => {
  try {
    const { customerId } = req.params;

    const orders = await Order.find({ customerId: customerId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders: orders,
    });
  } catch (error) {
    console.error("Error fetching customer orders:", error);
    res.status(500).json({
      message: "Error fetching customer orders",
      error: error.message,
    });
  }
};

// Get All Orders (Admin)
const getAllOrders = async (req, res) => {
  try {
    const { status, paymentStatus, limit = 50, skip = 0 } = req.query;

    let query = {};

    if (status) {
      query.orderStatus = status;
    }

    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      total: total,
      count: orders.length,
      orders: orders,
    });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({
      message: "Error fetching all orders",
      error: error.message,
    });
  }
};

// Update Order Status
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus, paymentStatus } = req.body;

    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        orderStatus: orderStatus || order?.orderStatus,
        paymentStatus: paymentStatus || order?.paymentStatus,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.status(200).json({
      message: "Order status updated",
      success: true,
      order: order,
    });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({
      message: "Error updating order",
      error: error.message,
    });
  }
};

// Cancel Order
const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;

    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        orderStatus: "cancelled",
        orderNotes: `Cancelled. Reason: ${reason || "No reason provided"}`,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.status(200).json({
      message: "Order cancelled successfully",
      success: true,
      order: order,
    });
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({
      message: "Error cancelling order",
      error: error.message,
    });
  }
};

// Get Order Statistics
const getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const completedOrders = await Order.countDocuments({ orderStatus: "delivered" });
    const pendingOrders = await Order.countDocuments({ orderStatus: "pending" });
    const cancelledOrders = await Order.countDocuments({ orderStatus: "cancelled" });

    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: "completed" } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalOrders,
        completedOrders,
        pendingOrders,
        cancelledOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
      },
    });
  } catch (error) {
    console.error("Error fetching order stats:", error);
    res.status(500).json({
      message: "Error fetching order statistics",
      error: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  getOrderByOrderId,
  getCustomerOrders,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  getOrderStats,
};
