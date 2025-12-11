# Quick Testing Guide - Order Management System

## 🚀 Quick Start Test Scenarios

### Prerequisites
- Backend server running on `http://localhost:5000`
- Frontend running on `http://localhost:5173` (or similar)
- MongoDB connected and seeded with test cards
- Email service configured with `.env` file

---

## ✅ Test Scenario 1: Customer Places Card Order

### Steps:
1. **Login as Customer**
   - Go to `/login`
   - Use any registered customer account credentials

2. **Add Items to Cart**
   - Navigate to Spare Parts page
   - Add multiple items to cart

3. **Proceed to Checkout**
   - Click "View Cart"
   - Click "Proceed to Checkout"

4. **Fill Delivery Information**
   - Enter first name
   - Enter last name
   - Enter email
   - Enter phone
   - Select delivery location
   - Enter address
   - Confirm address details

5. **Choose Card Payment**
   - Select "Credit/Debit Card" option
   - Click "Continue to Payment"

6. **Enter Card Details**
   - Use any test card from list below
   - **Recommended:** 4111111111111111 (John Doe)
   - Enter CVV: 123
   - Enter expiry: 10/26
   - Click "Pay Now"

7. **Verify Success**
   - Should see "Order Successful" page
   - Order ID displayed
   - Total amount confirmed

8. **Check Customer Dashboard**
   - Navigate to Account
   - Click "My Orders"
   - Should see the order just placed
   - Verify all details match

### Expected Results:
- ✅ Payment processes successfully
- ✅ Order appears in MyOrders dashboard
- ✅ Order status shows as "confirmed"
- ✅ Payment status shows as "completed"
- ✅ Email received in inbox (check spam folder)

---

## ✅ Test Scenario 2: Customer Places COD Order

### Steps:
1. **Login as Customer**
   - Use any registered customer account

2. **Add Items & Fill Delivery Info**
   - Same as Test Scenario 1 (steps 2-4)

3. **Choose Cash on Delivery**
   - Select "Cash on Delivery" option
   - Click "Continue to Payment"

4. **Confirm COD**
   - Review order summary
   - Click "Confirm Order"

5. **Verify Success**
   - Should see success confirmation page
   - Order ID displayed

6. **Check Dashboard**
   - Navigate to My Orders
   - Order should appear with payment status "pending"
   - Order status should be "confirmed"

### Expected Results:
- ✅ COD order created successfully
- ✅ Order appears in dashboard
- ✅ Payment status shows "pending" (no payment yet)
- ✅ Email confirmation received

---

## ✅ Test Scenario 3: Admin Manages Orders

### Steps:
1. **Login as Admin**
   - Navigate to `/login`
   - Use admin credentials

2. **Go to Admin Dashboard**
   - Click "Admin Dashboard" or navigate to `/admin-dashboard`
   - Select "Orders" from sidebar menu

3. **View All Orders**
   - Should see table with all orders
   - Check order count

4. **Filter by Status**
   - Click "Pending" - shows pending orders
   - Click "Confirmed" - shows confirmed orders
   - Click "All" - shows all orders

5. **Expand Order Details**
   - Click "View" button on any order
   - Should expand to show full details
   - Click "Hide" to collapse

6. **Update Order Status**
   - While expanded, click status update buttons
   - Change from "pending" → "confirmed" → "shipped" → "delivered"
   - Verify each update works

7. **Test Cancel Order**
   - Click "View" on an order
   - Button to cancel should appear
   - Click cancel and confirm
   - Order status should change to "cancelled"

### Expected Results:
- ✅ Admin sees all orders from all customers
- ✅ Filtering works correctly
- ✅ Order details expand/collapse
- ✅ Status updates work
- ✅ Cancel functionality works

---

## ✅ Test Scenario 4: Email Verification

### Steps:
1. **Make a Payment**
   - Complete Test Scenario 1 (Card Payment)

2. **Check Email Inbox**
   - Open email provider (Gmail, Outlook, etc.)
   - Look for two emails:
     - "Payment Confirmation - Order ORD-XXXXX"
     - "Order Confirmation - Order ORD-XXXXX"

3. **Verify Email Content**
   - Should see order ID, date, items
   - Should see total amount
   - Should see delivery address
   - Should see payment method
   - Professional HTML formatting

4. **Check Spam Folder**
   - If emails not in inbox, check Spam
   - Mark as "Not Spam" to improve delivery

### Expected Results:
- ✅ Two confirmation emails received
- ✅ Emails contain all order details
- ✅ Email formatting is professional
- ✅ All information is accurate

---

## 🧪 Test Card Numbers

Use these for testing in the payment form:

### ✅ Success Cards (Use these for successful payments)
| Card Number | Name | Expiry | CVV | Result |
|------------|------|--------|-----|--------|
| 4111111111111111 | JOHN DOE | 10/26 | 123 | Payment Success |
| 5555555555554445 | ALICE WILLIAMS | 08/28 | 321 | Payment Success |
| 378282246310005 | CHARLES BROWN | 09/26 | 654 | Payment Success |

### ❌ Test Failure Cards (Use these to test error handling)
| Card Number | Name | Expiry | CVV | Result |
|------------|------|--------|-----|--------|
| 4111111111111112 | JANE SMITH | 12/27 | 456 | Declined |
| 5555555555554444 | BOB JOHNSON | 06/25 | 789 | Expired |

---

## 🔍 Testing Checklist

### Frontend Components
- [ ] MyOrders component loads
- [ ] MyOrders fetches customer orders
- [ ] MyOrders displays orders correctly
- [ ] Order status colors are correct
- [ ] Loading spinner shows during fetch
- [ ] Error message displays if fetch fails
- [ ] Empty state shows if no orders

### Admin Dashboard
- [ ] AdminOrders page loads
- [ ] AdminOrders fetches all orders
- [ ] Filter buttons work correctly
- [ ] Order table displays all columns
- [ ] View/Hide button toggles details
- [ ] Status update buttons work
- [ ] Cancel button works
- [ ] Error handling works

### Payment System
- [ ] Card payment processes
- [ ] COD payment processes
- [ ] Success page displays
- [ ] Order created in database
- [ ] Order ID generated correctly
- [ ] Items saved with order

### Emails
- [ ] Payment confirmation email sent
- [ ] Order confirmation email sent
- [ ] Email contains correct order ID
- [ ] Email contains correct total
- [ ] Email contains delivery address
- [ ] Email HTML formatting is correct
- [ ] Email arrives within 5 seconds

### Database
- [ ] Order saved in MongoDB
- [ ] All fields populated correctly
- [ ] User relationship linked
- [ ] Payment transaction saved
- [ ] Timestamps created correctly

---

## 🐛 Debugging Tips

### Issue: Orders Not Appearing in MyOrders
```
1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Check for error messages
4. Check Network tab → see if API call succeeds
5. Verify userId is stored in localStorage
6. Check server logs for API endpoint errors
```

### Issue: Admin Can't See Orders
```
1. Verify logged in as admin user
2. Check user role in localStorage (should be "admin")
3. Check if orders exist in MongoDB
4. Verify `/api/orders/admin/all` endpoint is working
5. Check server logs
```

### Issue: Emails Not Sending
```
1. Check .env file has EMAIL_USER and EMAIL_PASSWORD
2. Verify Gmail App Password is correct (16 characters)
3. Check Gmail Less Secure Apps setting
4. Check server logs for email error messages
5. Try sending test email manually
6. Check spam folder
```

### Issue: Status Update Not Working
```
1. Check network tab to see if PUT request sent
2. Verify correct order ID is being used
3. Check server logs for errors
4. Try refreshing page after update
5. Verify admin is authenticated
```

---

## 📊 Expected Database Structure

After running through tests, your MongoDB should have:

### Orders Collection
```
{
  orderId: "ORD-1234567890",
  userId: ObjectId,
  paymentMethod: "card",
  paymentStatus: "completed",
  orderStatus: "confirmed",
  items: [...],
  total: 15000,
  deliveryAddress: {...},
  createdAt: Date,
  updatedAt: Date
}
```

### DummyCards Collection
```
{
  cardNumber: "4111111111111111",
  cardholderName: "JOHN DOE",
  expiryMonth: 10,
  expiryYear: 26,
  cvv: "123",
  status: "ACTIVE",
  usageCount: 5,
  lastUsed: Date
}
```

### PaymentTransactions Collection
```
{
  orderId: ObjectId,
  transactionId: "TXN-123456",
  amount: 15000,
  status: "completed",
  paymentMethod: "card",
  createdAt: Date
}
```

---

## ✨ Success Criteria

Your implementation is successful when:

✅ Customer can place an order  
✅ Order appears in customer dashboard  
✅ Admin can see all orders  
✅ Admin can update order status  
✅ Confirmation emails are received  
✅ Order details are accurate  
✅ No errors in console  
✅ No errors in server logs  
✅ All test cases pass  
✅ Database has all order records  

---

## 🆘 Support

If tests fail:

1. **Check server is running:**
   ```bash
   npm start  # in server directory
   ```

2. **Check frontend is running:**
   ```bash
   npm run dev  # in client directory
   ```

3. **Check MongoDB connection:**
   - Verify connection string in .env
   - Check MongoDB Atlas/Local instance is running

4. **Check email configuration:**
   - Verify .env file has EMAIL_USER and EMAIL_PASSWORD
   - Test Gmail App Password separately

5. **Check browser console:**
   - F12 → Console tab
   - Look for JavaScript errors

6. **Check server logs:**
   - Watch terminal running `npm start`
   - Look for error messages

---

**Last Updated:** January 2025  
**Version:** 1.0  
**Status:** Ready for Testing ✅
