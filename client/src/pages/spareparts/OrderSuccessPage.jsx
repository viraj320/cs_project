import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function OrderSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const state = location.state;
  const { orderId, transactionId, amount, paymentMethod, email } = state || {};

  if (!state) {
    return (
      <div className="container mx-auto my-8 text-center">
        <p className="text-red-600">Invalid success page. Please navigate properly.</p>
        <button
          onClick={() => navigate('/spareparts')}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded"
        >
          Back to Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 py-12">
      <div className="container mx-auto max-w-2xl">
        {/* Success Card */}
        <div className="bg-white rounded shadow-lg p-8 text-center">
          {/* Success Animation */}
          <div className="mb-6">
            <div className="inline-block">
              <svg className="w-20 h-20 text-green-600 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-green-600 mb-2">Order Confirmed!</h1>
          <p className="text-xl text-gray-600 mb-6">Thank you for your purchase</p>

          {/* Order Details */}
          <div className="bg-gray-50 p-6 rounded mb-6 text-left">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Order ID</p>
                <p className="text-lg font-bold text-gray-800">{orderId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Transaction ID</p>
                <p className="text-lg font-bold text-gray-800">{transactionId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Amount</p>
                <p className="text-lg font-bold text-green-600">LKR {amount?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Payment Method</p>
                <p className="text-lg font-bold text-gray-800">
                  {paymentMethod === 'card' ? 'Credit Card' : paymentMethod === 'cod' ? 'Cash on Delivery' : 'PayPal'}
                </p>
              </div>
            </div>
          </div>

          {/* Important Information */}
          <div className="bg-blue-50 p-6 rounded mb-6 text-left border-l-4 border-blue-500">
            <h3 className="font-bold text-lg text-gray-800 mb-3">📧 What's Next?</h3>
            <ul className="space-y-2 text-gray-700">
              <li>✓ A confirmation email has been sent to <strong>{email}</strong></li>
              <li>✓ Payment confirmation email contains transaction details</li>
              <li>✓ You will receive shipping updates via email</li>
              <li>✓ Estimated delivery: 3-5 business days</li>
              {paymentMethod === 'cod' && (
                <li>✓ Payment is due upon delivery to the delivery person</li>
              )}
            </ul>
          </div>

          {/* Payment Status */}
          {paymentMethod === 'card' && (
            <div className="bg-green-50 p-6 rounded mb-6 border-l-4 border-green-500">
              <h3 className="font-bold text-lg text-gray-800 mb-2">✓ Payment Confirmed</h3>
              <p className="text-gray-700">Your payment has been processed successfully. You can track your order using your Order ID.</p>
            </div>
          )}

          {paymentMethod === 'cod' && (
            <div className="bg-yellow-50 p-6 rounded mb-6 border-l-4 border-yellow-500">
              <h3 className="font-bold text-lg text-gray-800 mb-2">💵 Payment on Delivery</h3>
              <p className="text-gray-700">Please have LKR {amount?.toLocaleString()} ready when the delivery person arrives. Our delivery partner will contact you before arrival.</p>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-purple-50 p-6 rounded mb-6 text-left border-l-4 border-purple-500">
            <h3 className="font-bold text-lg text-gray-800 mb-3">🎯 You Can Now:</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• View your order details in your account dashboard</li>
              <li>• Track your shipment in real-time</li>
              <li>• Download invoice from your account</li>
              <li>• Contact support if you need any assistance</li>
            </ul>
          </div>

          {/* Support Information */}
          <div className="bg-gray-100 p-6 rounded mb-6">
            <p className="text-gray-700 mb-3">Need Help?</p>
            <div className="space-y-1 text-gray-600">
              <p>📧 Email: <strong>support@sparepartsshop.com</strong></p>
              <p>📞 Phone: <strong>+94 11 234 5678</strong></p>
              <p>💬 Live Chat: Available 9 AM - 6 PM, Mon - Fri</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-4">
            <button
              onClick={() => navigate('/account/myorders')}
              className="flex-1 bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 transition-colors"
            >
              View My Orders
            </button>
            <button
              onClick={() => navigate('/spareparts')}
              className="flex-1 bg-gray-300 text-gray-800 py-3 rounded font-semibold hover:bg-gray-400 transition-colors"
            >
              Continue Shopping
            </button>
          </div>

          {/* Thank You Message */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-gray-600">
              Thank you for shopping with us! We appreciate your business and look forward to serving you again.
            </p>
          </div>
        </div>

        {/* Order Information Card */}
        <div className="bg-white rounded shadow-lg p-8 mt-8">
          <h2 className="text-2xl font-bold mb-6">Order Information</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b">
              <span className="text-gray-700">Order Status</span>
              <span className="px-4 py-2 bg-green-100 text-green-800 rounded font-semibold">Confirmed</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b">
              <span className="text-gray-700">Payment Status</span>
              <span className="px-4 py-2 bg-green-100 text-green-800 rounded font-semibold">
                {paymentMethod === 'cod' ? 'Pending (Due on Delivery)' : 'Completed'}
              </span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b">
              <span className="text-gray-700">Estimated Delivery</span>
              <span className="font-semibold text-gray-800">3-5 Business Days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Reference Number</span>
              <span className="font-mono font-semibold text-gray-800">{transactionId}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccessPage;
