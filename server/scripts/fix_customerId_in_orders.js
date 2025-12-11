// Usage: node scripts/fix_customerId_in_orders.js <customerEmail> <customerId>
// Example: node scripts/fix_customerId_in_orders.js "s19387@sci.pdn.ac.lk" "654321abcdef123456789012"

const mongoose = require('mongoose');
const Order = require('../models/Order');
const PaymentTransaction = require('../models/PaymentTransaction');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sp_db';

async function main() {
  const [,, customerEmail, customerId] = process.argv;
  if (!customerEmail || !customerId) {
    console.error('Usage: node fix_customerId_in_orders.js <customerEmail> <customerId>');
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB');

  // Update Orders
  const orderResult = await Order.updateMany(
    { customerEmail: customerEmail },
    { $set: { customerId: customerId } }
  );
  console.log(`Orders updated: ${orderResult.modifiedCount}`);

  // Update PaymentTransactions
  const paymentResult = await PaymentTransaction.updateMany(
    { customerEmail: customerEmail },
    { $set: { customerId: customerId } }
  );
  console.log(`PaymentTransactions updated: ${paymentResult.modifiedCount}`);

  await mongoose.disconnect();
  console.log('Done.');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
