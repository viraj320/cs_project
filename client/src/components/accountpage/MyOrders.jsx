import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchCustomerOrders();
  }, [user]);

  const fetchCustomerOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const userId = user?._id || JSON.parse(localStorage.getItem('user'))?._id;
      
      if (!userId) {
        setError('User not found. Please login again.');
        setLoading(false);
        return;
      }

      const response = await axios.get(`http://localhost:5000/api/orders/customer/${userId}`);
      
      if (response.data.success) {
        setOrders(response.data.orders || []);
      } else {
        setError(response.data.message || 'Failed to fetch orders');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.response?.data?.message || 'Failed to load orders. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-8 rounded shadow-md">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            <p className="mt-4 text-gray-600">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">My Orders</h2>
      <hr className="border-red-500 w-20 mb-6" />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">You haven't placed any orders yet.</p>
          <p className="text-gray-400 mt-2">Start shopping and place your first order!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
              {/* Order Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Order {order.orderId}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-red-600">LKR {order.total?.toLocaleString()}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {order.paymentStatus === 'completed' ? (
                      <span className="text-green-600 font-semibold">✓ Paid</span>
                    ) : order.paymentStatus === 'pending' ? (
                      <span className="text-yellow-600 font-semibold">⏳ Pending</span>
                    ) : (
                      <span className="text-red-600 font-semibold">✗ Failed</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Order Status */}
              <div className="mb-4 p-3 bg-blue-50 rounded">
                <p className="text-sm font-semibold text-gray-700 mb-2">Order Status:</p>
                <p className="text-sm">
                  {order.orderStatus === 'confirmed' ? (
                    <span className="text-green-600">✓ Confirmed</span>
                  ) : order.orderStatus === 'pending' ? (
                    <span className="text-yellow-600">⏳ Pending</span>
                  ) : order.orderStatus === 'shipped' ? (
                    <span className="text-blue-600">📦 Shipped</span>
                  ) : order.orderStatus === 'delivered' ? (
                    <span className="text-green-600">✓ Delivered</span>
                  ) : order.orderStatus === 'cancelled' ? (
                    <span className="text-red-600">✗ Cancelled</span>
                  ) : (
                    <span className="text-gray-600">{order.orderStatus}</span>
                  )}
                </p>
              </div>

              {/* Order Items */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-700 mb-2">Items:</h4>
                <div className="space-y-2">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      <span>{item.name}</span>
                      <span className="font-medium">
                        {item.quantity} × LKR {item.price?.toLocaleString()} = LKR {(item.quantity * item.price)?.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Info */}
              <div className="mb-4 p-3 bg-gray-50 rounded">
                <p className="text-sm font-semibold text-gray-700 mb-2">Delivery Address:</p>
                <p className="text-sm text-gray-600">
                  {order.deliveryAddress?.firstName} {order.deliveryAddress?.lastName}<br />
                  {order.deliveryAddress?.address1}<br />
                  {order.deliveryAddress?.city}, {order.deliveryAddress?.state} {order.deliveryAddress?.zip}
                </p>
              </div>

              {/* Price Breakdown */}
              <div className="border-t pt-3">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Subtotal:</span>
                  <span>LKR {order.subtotal?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Delivery Fee ({order.deliveryLocation}):</span>
                  <span>{order.deliveryFee === 0 ? 'FREE' : `LKR ${order.deliveryFee?.toLocaleString()}`}</span>
                </div>
                <div className="flex justify-between font-semibold text-gray-800">
                  <span>Total:</span>
                  <span>LKR {order.total?.toLocaleString()}</span>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mt-4 pt-3 border-t text-sm">
                <span className="font-semibold text-gray-700">Payment Method: </span>
                <span className="text-gray-600">
                  {order.paymentMethod === 'card' ? '💳 Credit/Debit Card' : '💵 Cash on Delivery'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
