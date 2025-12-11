const Order = require("../models/Order");
const PaymentTransaction = require("../models/PaymentTransaction");
const DummyCard = require("../models/DummyCard");
const { sendPaymentConfirmationEmail, sendOrderConfirmationEmail } = require("../utils/emailService");

// Validate Dummy Card from Database
const validateDummyCardFromDB = async (cardNumber, expiryMonth, expiryYear, cvv) => {
  try {
    // Find the card in database
    const card = await DummyCard.findOne({ cardNumber });
    
    if (!card) {
      return { valid: false, error: "Card not found in system" };
    }

    // Check card status
    if (card.status === 'declined') {
      return { valid: false, error: "Card has been declined" };
    }

    if (card.status === 'expired') {
      return { valid: false, error: "Card has expired" };
    }

    // Validate basic fields
    if (!cardNumber || cardNumber.length < 13) {
      return { valid: false, error: "Invalid card number" };
    }
    if (!expiryMonth || !expiryYear) {
      return { valid: false, error: "Invalid expiry date" };
    }
    if (!cvv || cvv.length < 3) {
      return { valid: false, error: "Invalid CVV" };
    }

    // Validate CVV matches
    if (card.cvv !== cvv) {
      return { valid: false, error: "Invalid CVV" };
    }

    // Validate expiry matches
    if (card.expiryMonth !== expiryMonth || card.expiryYear !== expiryYear) {
      return { valid: false, error: "Invalid expiry date" };
    }

    // Check if card is actually expired (by date)
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    
    let fullYear = parseInt(expiryYear);
    if (expiryYear.length === 2) {
      fullYear = 2000 + fullYear;
    }
    const expMonth = parseInt(expiryMonth);
    
    if (fullYear < currentYear || (fullYear === currentYear && expMonth < currentMonth)) {
      return { valid: false, error: "Card has expired" };
    }

    return { valid: true, card };
  } catch (error) {
    console.error('Error validating card from DB:', error);
    return { valid: false, error: "Error validating card: " + error.message };
  }
};

// Process Card Payment
const processCardPayment = async (req, res) => {
  try {
    const {
      orderId,
      cardNumber,
      cardholderName,
      expiryMonth,
      expiryYear,
      cvv,
      amount,
    } = req.body;

    console.log('Processing card payment:', { cardNumber: cardNumber.slice(-4), cardholderName });

    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Validate card details from database
    const validation = await validateDummyCardFromDB(cardNumber, expiryMonth, expiryYear, cvv);
    if (!validation.valid) {
      console.log('Card validation failed:', validation.error);
      return res.status(400).json({ message: validation.error });
    }

    // Check if this is a declined card (marked in DB)
    const declined = validation.card.status === 'declined';

    // Create Payment Transaction Record
    const lastFourDigits = cardNumber.slice(-4);
    const cardType = validation.card.cardType;

    const paymentTransaction = new PaymentTransaction({
      orderId: order._id,
      customerId: order.customerId,
      customerEmail: order.customerEmail,
      paymentMethod: "card",
      cardDetails: {
        lastFourDigits: lastFourDigits,
        cardholderName: cardholderName,
        expiryMonth: expiryMonth,
        expiryYear: expiryYear,
        cardType: cardType,
      },
      amount: amount,
      status: declined ? "failed" : "completed",
      gatewayResponse: {
        statusCode: declined ? "DECLINED" : "APPROVED",
        message: declined ? "Card was declined" : "Payment approved",
        referenceNumber: `REF-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      },
      processedAt: new Date(),
    });

    await paymentTransaction.save();

    // Update card usage in DB
    validation.card.lastUsed = new Date();
    validation.card.usageCount = (validation.card.usageCount || 0) + 1;
    await validation.card.save();

    // Update Order Status
    if (!declined) {
      order.paymentStatus = "completed";
      order.orderStatus = "confirmed";
      await order.save();

      console.log('Payment successful for order:', order.orderId);

      // Send both confirmation emails
      const paymentEmailData = {
        ...order.toObject(),
        transactionId: paymentTransaction.transactionId,
        cardDetails: paymentTransaction.cardDetails,
      };

      await sendPaymentConfirmationEmail(paymentEmailData);
      await sendOrderConfirmationEmail(order.toObject());

      return res.status(200).json({
        message: "Payment processed successfully",
        success: true,
        transactionId: paymentTransaction.transactionId,
        orderStatus: "confirmed",
      });
    } else {
      order.paymentStatus = "failed";
      await order.save();

      console.log('Payment declined for order:', order.orderId);

      return res.status(400).json({
        message: "Payment declined. Please try another card.",
        success: false,
        transactionId: paymentTransaction.transactionId,
      });
    }
  } catch (error) {
    console.error("Card payment error:", error);
    res.status(500).json({ message: "Error processing payment", error: error.message });
  }
};

// Process COD (Cash on Delivery)
const processCODPayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Create Payment Transaction Record for COD
    const paymentTransaction = new PaymentTransaction({
      orderId: order._id,
      customerId: order.customerId,
      customerEmail: order.customerEmail,
      paymentMethod: "cod",
      amount: order.total,
      status: "pending",
      gatewayResponse: {
        statusCode: "COD_PENDING",
        message: "Cash on Delivery - Awaiting payment at delivery",
        referenceNumber: `COD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      },
    });

    await paymentTransaction.save();

    // Update Order Status
    order.paymentStatus = "pending";
    order.orderStatus = "confirmed";
    await order.save();

    // Send confirmation emails
    const paymentEmailData = {
      ...order.toObject(),
      transactionId: paymentTransaction.transactionId,
      paymentMethod: "cod",
    };

    await sendPaymentConfirmationEmail(paymentEmailData);
    await sendOrderConfirmationEmail(order.toObject());

    return res.status(200).json({
      message: "Order confirmed with Cash on Delivery",
      success: true,
      transactionId: paymentTransaction.transactionId,
      orderStatus: "confirmed",
      note: "Payment will be collected upon delivery",
    });
  } catch (error) {
    console.error("COD processing error:", error);
    res.status(500).json({ message: "Error processing COD", error: error.message });
  }
};

// Get Payment Transaction Details
const getPaymentTransaction = async (req, res) => {
  try {
    const { transactionId } = req.params;

    const transaction = await PaymentTransaction.findOne({ transactionId: transactionId }).populate(
      "orderId customerId"
    );

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({
      success: true,
      transaction: transaction,
    });
  } catch (error) {
    console.error("Error fetching transaction:", error);
    res.status(500).json({ message: "Error fetching transaction", error: error.message });
  }
};

// Get All Transactions for Admin
const getAllTransactions = async (req, res) => {
  try {
    const transactions = await PaymentTransaction.find()
      .populate("orderId customerId")
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: transactions.length,
      transactions: transactions,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Error fetching transactions", error: error.message });
  }
};

// Refund Payment
const refundPayment = async (req, res) => {
  try {
    const { transactionId, reason } = req.body;

    const transaction = await PaymentTransaction.findOne({ transactionId: transactionId });
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (transaction.status === "refunded") {
      return res.status(400).json({ message: "Payment already refunded" });
    }

    transaction.status = "refunded";
    transaction.gatewayResponse.message = `Refund processed. Reason: ${reason || "No reason provided"}`;
    await transaction.save();

    // Update order status
    const order = await Order.findById(transaction.orderId);
    if (order) {
      order.paymentStatus = "refunded";
      await order.save();
    }

    res.status(200).json({
      message: "Payment refunded successfully",
      success: true,
      transactionId: transactionId,
    });
  } catch (error) {
    console.error("Refund error:", error);
    res.status(500).json({ message: "Error processing refund", error: error.message });
  }
};

module.exports = {
  processCardPayment,
  processCODPayment,
  getPaymentTransaction,
  getAllTransactions,
  refundPayment,
};
