const nodemailer = require("nodemailer");

// Create transporter - using Gmail as example (configure with your email service)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASSWORD, // Your app password
  },
});

// Payment Confirmation Email Template
const getPaymentConfirmationEmail = (orderData) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
        .content { background-color: #f9fafb; padding: 20px; }
        .section { margin: 20px 0; padding: 15px; background-color: white; border-radius: 5px; }
        .section-title { font-size: 18px; font-weight: bold; color: #dc2626; margin-bottom: 10px; }
        .payment-method { background-color: #fef2f2; padding: 15px; border-radius: 5px; margin: 10px 0; }
        .order-items { width: 100%; border-collapse: collapse; margin: 10px 0; }
        .order-items th, .order-items td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
        .order-items th { background-color: #f3f4f6; font-weight: bold; }
        .total-section { background-color: #fef2f2; padding: 15px; border-radius: 5px; margin: 15px 0; }
        .total-row { display: flex; justify-content: space-between; margin: 10px 0; font-size: 16px; }
        .total-amount { font-weight: bold; color: #dc2626; font-size: 20px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; background-color: #f9fafb; border-radius: 0 0 5px 5px; }
        .badge { display: inline-block; padding: 5px 10px; background-color: #dcfce7; color: #166534; border-radius: 3px; font-size: 12px; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Payment Confirmed!</h1>
          <p>Thank you for your order</p>
        </div>

        <div class="content">
          <div class="section">
            <div class="section-title">Order Details</div>
            <p><strong>Order ID:</strong> ${orderData.orderId}</p>
            <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Status:</strong> <span class="badge">Confirmed</span></p>
          </div>

          <div class="section">
            <div class="section-title">Payment Information</div>
            <div class="payment-method">
              <p><strong>Payment Method:</strong> ${orderData.paymentMethod === "card" ? "Credit/Debit Card" : orderData.paymentMethod === "cod" ? "Cash on Delivery" : "PayPal"}</p>
              ${
                orderData.cardDetails
                  ? `
                <p><strong>Card Type:</strong> ${orderData.cardDetails.cardType}</p>
                <p><strong>Card Number:</strong> **** **** **** ${orderData.cardDetails.lastFourDigits}</p>
                <p><strong>Cardholder:</strong> ${orderData.cardDetails.cardholderName}</p>
                <p><strong>Expiry:</strong> ${orderData.cardDetails.expiryMonth}/${orderData.cardDetails.expiryYear}</p>
              `
                  : ""
              }
              <p><strong>Transaction ID:</strong> ${orderData.transactionId}</p>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Order Items</div>
            <table class="order-items">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${orderData.items
                  .map(
                    (item) => `
                  <tr>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>LKR ${item.price.toLocaleString()}</td>
                    <td>LKR ${(item.price * item.quantity).toLocaleString()}</td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>

            <div class="total-section">
              <div class="total-row">
                <span>Subtotal:</span>
                <span>LKR ${orderData.subtotal.toLocaleString()}</span>
              </div>
              <div class="total-row">
                <span>Delivery Fee (${orderData.deliveryLocation}):</span>
                <span>${orderData.deliveryFee === 0 ? "FREE" : `LKR ${orderData.deliveryFee.toLocaleString()}`}</span>
              </div>
              <div class="total-row total-amount">
                <span>Total Amount:</span>
                <span>LKR ${orderData.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Delivery Address</div>
            <p>
              ${orderData.deliveryAddress.firstName} ${orderData.deliveryAddress.lastName}<br>
              ${orderData.deliveryAddress.address1}<br>
              ${orderData.deliveryAddress.address2 ? orderData.deliveryAddress.address2 + "<br>" : ""}
              ${orderData.deliveryAddress.city}, ${orderData.deliveryAddress.state} ${orderData.deliveryAddress.zip}<br>
              ${orderData.deliveryAddress.country}
            </p>
          </div>

          <div class="section">
            <div class="section-title">What's Next?</div>
            <ul>
              <li>✓ Payment has been confirmed</li>
              <li>📦 We will prepare your order for shipment</li>
              <li>🚚 You will receive a shipping confirmation with tracking details</li>
              <li>📞 If you have any questions, contact us at support@sparepartsshop.com</li>
            </ul>
          </div>
        </div>

        <div class="footer">
          <p>&copy; 2025 Spare Parts Shop. All rights reserved.</p>
          <p>This is an automated email. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Order Confirmation Email Template
const getOrderConfirmationEmail = (orderData) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #059669; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
        .content { background-color: #f9fafb; padding: 20px; }
        .section { margin: 20px 0; padding: 15px; background-color: white; border-radius: 5px; }
        .section-title { font-size: 18px; font-weight: bold; color: #059669; margin-bottom: 10px; }
        .status-box { background-color: #dcfce7; padding: 15px; border-radius: 5px; margin: 10px 0; border-left: 4px solid #059669; }
        .order-items { width: 100%; border-collapse: collapse; margin: 10px 0; }
        .order-items th, .order-items td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
        .order-items th { background-color: #f3f4f6; font-weight: bold; }
        .timeline { margin: 20px 0; }
        .timeline-item { padding: 15px; margin: 10px 0; border-left: 3px solid #059669; background-color: #f0fdf4; }
        .timeline-item.current { border-left-color: #059669; background-color: #dcfce7; }
        .timeline-item.pending { border-left-color: #d1d5db; background-color: #f9fafb; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; background-color: #f9fafb; border-radius: 0 0 5px 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Order Confirmed!</h1>
          <p>Your order has been successfully placed</p>
        </div>

        <div class="content">
          <div class="section">
            <div class="section-title">Order Confirmation</div>
            <p><strong>Order ID:</strong> ${orderData.orderId}</p>
            <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Customer Name:</strong> ${orderData.customerName}</p>
            <p><strong>Email:</strong> ${orderData.customerEmail}</p>
            <p><strong>Phone:</strong> ${orderData.customerPhone}</p>
          </div>

          <div class="section">
            <div class="section-title">Order Items</div>
            <table class="order-items">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${orderData.items
                  .map(
                    (item) => `
                  <tr>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>LKR ${item.price.toLocaleString()}</td>
                    <td>LKR ${(item.price * item.quantity).toLocaleString()}</td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>

            <div style="background-color: #f0fdf4; padding: 15px; border-radius: 5px; margin-top: 15px;">
              <p style="margin: 5px 0;"><strong>Subtotal:</strong> LKR ${orderData.subtotal.toLocaleString()}</p>
              <p style="margin: 5px 0;"><strong>Delivery Fee:</strong> ${orderData.deliveryFee === 0 ? "FREE" : `LKR ${orderData.deliveryFee.toLocaleString()}`}</p>
              <p style="margin: 5px 0; font-size: 18px; font-weight: bold; color: #059669;">
                <strong>Total:</strong> LKR ${orderData.total.toLocaleString()}
              </p>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Delivery Information</div>
            <p>
              <strong>Delivery Location:</strong> ${orderData.deliveryLocation}<br>
              <strong>Address:</strong><br>
              ${orderData.deliveryAddress.firstName} ${orderData.deliveryAddress.lastName}<br>
              ${orderData.deliveryAddress.address1}<br>
              ${orderData.deliveryAddress.address2 ? orderData.deliveryAddress.address2 + "<br>" : ""}
              ${orderData.deliveryAddress.city}, ${orderData.deliveryAddress.state} ${orderData.deliveryAddress.zip}<br>
              ${orderData.deliveryAddress.country}
            </p>
          </div>

          <div class="section">
            <div class="section-title">Order Status Timeline</div>
            <div class="timeline">
              <div class="timeline-item current">
                <strong>✅ Order Confirmed</strong>
                <p>Your order has been successfully confirmed</p>
              </div>
              <div class="timeline-item pending">
                <strong>📦 Processing</strong>
                <p>Your items are being prepared for shipment</p>
              </div>
              <div class="timeline-item pending">
                <strong>🚚 Shipped</strong>
                <p>Your order is on its way (tracking info will be sent)</p>
              </div>
              <div class="timeline-item pending">
                <strong>📬 Delivered</strong>
                <p>Your order will arrive at the delivery address</p>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Need Help?</div>
            <ul>
              <li>📧 Email: support@sparepartsshop.com</li>
              <li>📞 Phone: +94 11 234 5678</li>
              <li>💬 Live Chat: Available 9 AM - 6 PM, Mon - Fri</li>
              <li>🔍 Track your order: Use Order ID in your account dashboard</li>
            </ul>
          </div>
        </div>

        <div class="footer">
          <p>&copy; 2025 Spare Parts Shop. All rights reserved.</p>
          <p>This is an automated email. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Send Email Function
const sendEmail = async (to, subject, htmlContent) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: subject,
      html: htmlContent,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", result.response);
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, message: error.message };
  }
};

// Send Payment Confirmation Email
const sendPaymentConfirmationEmail = async (orderData) => {
  const htmlContent = getPaymentConfirmationEmail(orderData);
  return sendEmail(
    orderData.customerEmail,
    `Payment Confirmation - Order ${orderData.orderId}`,
    htmlContent
  );
};

// Send Order Confirmation Email
const sendOrderConfirmationEmail = async (orderData) => {
  const htmlContent = getOrderConfirmationEmail(orderData);
  return sendEmail(
    orderData.customerEmail,
    `Order Confirmation - Order ${orderData.orderId}`,
    htmlContent
  );
};

module.exports = {
  sendEmail,
  sendPaymentConfirmationEmail,
  sendOrderConfirmationEmail,
};
