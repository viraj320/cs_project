import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

function CODPaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useContext(CartContext);
  
  const state = location.state;
  const { items, subtotal, deliveryFee, total, selectedLocation, formData } = state || {};

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const { user } = useContext(AuthContext);
  const createOrder = async () => {
    try {
      if (!formData) {
        throw new Error('Form data is missing. Please go back and fill the checkout form.');
      }
      if (!items || items.length === 0) {
        throw new Error('No items in cart. Please add items before checkout.');
      }
      const validatedItems = items.map(item => ({
        name: item.name || 'Unknown Item',
        price: item.price || 0,
        quantity: item.quantity || 1,
        _id: item._id,
      }));
      const orderPayload = {
        customerId: user?._id,
        customerEmail: formData?.email || '',
        customerPhone: formData?.phone || '',
        customerName: `${formData?.firstName || ''} ${formData?.lastName || ''}`.trim() || 'Unknown',
        items: validatedItems,
        deliveryLocation: selectedLocation || 'colombo',
        deliveryAddress: {
          firstName: formData?.firstName || '',
          lastName: formData?.lastName || '',
          address1: formData?.address1 || '',
          address2: formData?.address2 || '',
          city: formData?.city || '',
          zip: formData?.zip || '',
          state: formData?.state || '',
          country: formData?.country || 'Sri Lanka',
        },
        subtotal: subtotal || 0,
        deliveryFee: deliveryFee || 0,
        total: total || 0,
        paymentMethod: 'cod',
      };
      console.log('Creating COD order with payload:', orderPayload);
      const response = await axios.post('http://localhost:5000/api/orders/create', orderPayload);
      return response.data.order;
    } catch (err) {
      console.error('Order creation error:', err);
      throw new Error('Failed to create order: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleConfirmCOD = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      // Create order first
      const order = await createOrder();

      // Process COD
      const paymentResponse = await axios.post('http://localhost:5000/api/payments/cod', {
        orderId: order._id,
      });

      if (paymentResponse.data.success) {
        setMessage('✓ Order confirmed! Confirmation email sent. Payment due on delivery.');
        clearCart();
        setTimeout(() => {
          navigate('/order-success', {
            state: {
              orderId: order.orderId,
              transactionId: paymentResponse.data.transactionId,
              amount: total,
              paymentMethod: 'cod',
              email: formData?.email,
            }
          });
        }, 2000);
      } else {
        setError(paymentResponse.data.message || 'Order confirmation failed');
      }
    } catch (err) {
      setError(err.message || 'Error confirming order');
      console.error('COD error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!state) {
    return (
      <div className="container mx-auto my-8 text-center">
        <p className="text-red-600">Invalid order session. Please start over.</p>
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
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* COD Confirmation */}
          <div className="bg-white p-8 rounded shadow">
            <h1 className="text-2xl font-bold mb-6">Cash on Delivery Confirmation</h1>

            <div className="space-y-6">
              <div className="bg-green-50 p-6 rounded border border-green-200">
                <div className="flex items-start">
                  <span className="text-3xl text-green-600 mr-4">💵</span>
                  <div>
                    <h3 className="font-bold text-lg text-green-800">Payment on Delivery</h3>
                    <p className="text-green-700 mt-2">
                      You will pay the delivery person when they arrive at your location.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded border border-blue-200">
                <h3 className="font-bold text-lg mb-3">Delivery Instructions:</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ Our delivery partner will contact you before arrival</li>
                  <li>✓ Have the exact amount ready (LKR {total?.toLocaleString()})</li>
                  <li>✓ Verify items before completing payment</li>
                  <li>✓ Request a receipt for your records</li>
                </ul>
              </div>

              <div className="bg-yellow-50 p-6 rounded border border-yellow-200">
                <h3 className="font-bold text-lg mb-2">Important Notes:</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Delivery will be within 3-5 business days</li>
                  <li>• You'll receive tracking info via email</li>
                  <li>• Change of delivery address can be made within 24 hours</li>
                  <li>• Contact support@sparepartsshop.com for urgent changes</li>
                </ul>
              </div>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  ✗ {error}
                </div>
              )}

              {message && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                  {message}
                </div>
              )}

              <button
                onClick={handleConfirmCOD}
                disabled={loading}
                className={`w-full py-3 rounded font-semibold text-white transition-colors ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {loading ? 'Processing...' : 'Confirm Order - Pay on Delivery'}
              </button>

              <button
                type="button"
                onClick={() => navigate(-1)}
                className="w-full py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Back to Checkout
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white p-8 rounded shadow">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6">
              {items?.map((item) => (
                <div key={item._id} className="flex justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">{item.quantity} × LKR {item.price?.toLocaleString()}</p>
                  </div>
                  <p className="font-semibold">LKR {(item.price * item.quantity)?.toLocaleString()}</p>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>LKR {subtotal?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>{deliveryFee === 0 ? 'FREE' : `LKR ${deliveryFee?.toLocaleString()}`}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                <span>Total Amount Due</span>
                <span className="text-red-600">LKR {total?.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded">
              <p className="text-sm text-gray-700"><strong>Delivery Address:</strong></p>
              <p className="text-sm text-gray-600">
                {formData?.firstName} {formData?.lastName}<br/>
                {formData?.address1}<br/>
                {formData?.city}, {formData?.state} {formData?.zip}<br/>
                {formData?.country}
              </p>
            </div>

            <div className="mt-6 p-4 bg-purple-50 rounded">
              <p className="text-sm text-gray-700"><strong>Contact Information:</strong></p>
              <p className="text-sm text-gray-600">
                Email: {formData?.email}<br/>
                Phone: {formData?.phone}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CODPaymentPage;
