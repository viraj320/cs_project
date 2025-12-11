import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

function CardPaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useContext(CartContext);
  
  const state = location.state;
  const { items, subtotal, deliveryFee, total, selectedLocation, formData } = state || {};

  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardData(prev => ({
      ...prev,
      [name]: value
    }));
  };

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
        paymentMethod: 'card',
      };
      console.log('Creating order with payload:', orderPayload);
      const response = await axios.post('http://localhost:5000/api/orders/create', orderPayload);
      return response.data.order;
    } catch (err) {
      console.error('Order creation error:', err);
      throw new Error('Failed to create order: ' + (err.response?.data?.message || err.message));
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      // Validate card data
      if (!cardData.cardNumber || !cardData.cardholderName || !cardData.expiryMonth || !cardData.expiryYear || !cardData.cvv) {
        throw new Error('Please fill in all card details');
      }

      // Create order first
      const order = await createOrder();

      // Process payment
      const paymentPayload = {
        orderId: order._id,
        cardNumber: cardData.cardNumber.replace(/\s/g, ''),
        cardholderName: cardData.cardholderName,
        expiryMonth: cardData.expiryMonth,
        expiryYear: cardData.expiryYear,
        cvv: cardData.cvv,
        amount: total,
      };

      console.log('Processing payment with payload:', paymentPayload);

      const paymentResponse = await axios.post('http://localhost:5000/api/payments/card', paymentPayload);

      if (paymentResponse.data.success) {
        setMessage('✓ Payment successful! Order confirmation email sent.');
        clearCart();
        setTimeout(() => {
          navigate('/order-success', {
            state: {
              orderId: order.orderId,
              transactionId: paymentResponse.data.transactionId,
              amount: total,
              paymentMethod: 'card',
              email: formData?.email,
            }
          });
        }, 2000);
      } else {
        setError(paymentResponse.data.message || 'Payment failed');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Error processing payment';
      setError(errorMessage);
      console.error('Payment error details:', {
        status: err.response?.status,
        message: err.response?.data?.message,
        fullError: err
      });
    } finally {
      setLoading(false);
    }
  };

  if (!state) {
    return (
      <div className="container mx-auto my-8 text-center">
        <p className="text-red-600">Invalid payment session. Please start over.</p>
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
          {/* Payment Form */}
          <div className="bg-white p-8 rounded shadow">
            <h1 className="text-2xl font-bold mb-6">Card Payment</h1>

            <form onSubmit={handlePayment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={cardData.cardNumber}
                  onChange={handleCardChange}
                  placeholder="4111 1111 1111 1111"
                  maxLength="19"
                  className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Test: 4111111111111111 (success) or 4111111111111112 (decline)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                <input
                  type="text"
                  name="cardholderName"
                  value={cardData.cardholderName}
                  onChange={handleCardChange}
                  placeholder="John Doe"
                  className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
                  <select
                    name="expiryMonth"
                    value={cardData.expiryMonth}
                    onChange={handleCardChange}
                    className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">MM</option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                        {String(i + 1).padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                  <select
                    name="expiryYear"
                    value={cardData.expiryYear}
                    onChange={handleCardChange}
                    className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">YY</option>
                    {Array.from({ length: 10 }, (_, i) => {
                      const year = new Date().getFullYear() + i;
                      return (
                        <option key={year} value={String(year).slice(-2)}>
                          {String(year).slice(-2)}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    value={cardData.cvv}
                    onChange={handleCardChange}
                    placeholder="123"
                    maxLength="4"
                    className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
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
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded font-semibold text-white transition-colors ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {loading ? 'Processing...' : `Pay LKR ${total?.toLocaleString()}`}
              </button>

              <button
                type="button"
                onClick={() => navigate(-1)}
                className="w-full py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Back to Checkout
              </button>
            </form>
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
                <span>Total</span>
                <span className="text-red-600">LKR {total?.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded">
              <p className="text-sm text-gray-700"><strong>Billing Address:</strong></p>
              <p className="text-sm text-gray-600">
                {formData?.firstName} {formData?.lastName}<br/>
                {formData?.address1}<br/>
                {formData?.city}, {formData?.state} {formData?.zip}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardPaymentPage;
