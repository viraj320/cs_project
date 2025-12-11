import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:5000/api/orders/admin/all');
      
      if (response.data.success) {
        setOrders(response.data.orders || []);
      } else {
        setError(response.data.message || 'Failed to fetch orders');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdatingOrderId(orderId);
      const response = await axios.put(
        `http://localhost:5000/api/orders/${orderId}/status`,
        { orderStatus: newStatus }
      );

      if (response.data.success) {
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, orderStatus: newStatus } : order
        ));
        setSelectedOrder(null);
      }
    } catch (err) {
      console.error('Error updating order:', err);
      alert('Failed to update order status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const cancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    try {
      setUpdatingOrderId(orderId);
      const response = await axios.post(
        `http://localhost:5000/api/orders/${orderId}/cancel`
      );

      if (response.data.success) {
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, orderStatus: 'cancelled' } : order
        ));
        setSelectedOrder(null);
      }
    } catch (err) {
      console.error('Error canceling order:', err);
      alert('Failed to cancel order');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const getFilteredOrders = () => {
    if (filterStatus === 'all') return orders;
    return orders.filter(order => order.orderStatus === filterStatus);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            <p className="mt-4 text-gray-600">Loading orders...</p>
          </div>
        </div>
      </div>
    );
  }

  const filteredOrders = getFilteredOrders();

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Orders Management</h1>
        <p className="text-gray-600 mb-6">Manage and track all customer orders</p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Filter Section */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Filter by Status</h2>
          <div className="flex flex-wrap gap-2">
            {['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded font-medium transition-all ${
                  filterStatus === status
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-4">
            Showing {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Orders Table */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">No orders found</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Order ID</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Customer</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Total</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Items</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Order Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Payment Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <React.Fragment key={order._id}>
                      <tr className="border-b hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.orderId}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <div>
                            <p className="font-medium">{order.userId?.firstName} {order.userId?.lastName}</p>
                            <p className="text-xs text-gray-500">{order.userId?.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-red-600">
                          LKR {order.total?.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.orderStatus)}`}>
                            {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(order.paymentStatus)}`}>
                            {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </td>
                        <td className="px-6 py-4 text-sm space-x-2">
                          <button
                            onClick={() => setSelectedOrder(selectedOrder?._id === order._id ? null : order)}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            {selectedOrder?._id === order._id ? 'Hide' : 'View'}
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Order Details */}
                      {selectedOrder?._id === order._id && (
                        <tr className="bg-blue-50 border-b">
                          <td colSpan="8" className="px-6 py-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Left Column */}
                              <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Details</h3>
                                
                                <div className="mb-4">
                                  <p className="text-sm font-semibold text-gray-700 mb-1">Items:</p>
                                  <div className="space-y-2">
                                    {order.items?.map((item, idx) => (
                                      <div key={idx} className="bg-white p-2 rounded text-sm text-gray-600">
                                        <p>{item.name} × {item.quantity}</p>
                                        <p className="text-xs text-gray-500">
                                          LKR {item.price?.toLocaleString()} each = LKR {(item.quantity * item.price)?.toLocaleString()}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div className="mb-4">
                                  <p className="text-sm font-semibold text-gray-700 mb-2">Price Breakdown:</p>
                                  <div className="bg-white p-3 rounded text-sm space-y-1">
                                    <div className="flex justify-between">
                                      <span>Subtotal:</span>
                                      <span>LKR {order.subtotal?.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Delivery Fee:</span>
                                      <span>{order.deliveryFee === 0 ? 'FREE' : `LKR ${order.deliveryFee?.toLocaleString()}`}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-red-600 pt-1 border-t">
                                      <span>Total:</span>
                                      <span>LKR {order.total?.toLocaleString()}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Right Column */}
                              <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Delivery & Payment</h3>
                                
                                <div className="mb-4">
                                  <p className="text-sm font-semibold text-gray-700 mb-1">Delivery Address:</p>
                                  <div className="bg-white p-3 rounded text-sm text-gray-600">
                                    <p className="font-medium">
                                      {order.deliveryAddress?.firstName} {order.deliveryAddress?.lastName}
                                    </p>
                                    <p>{order.deliveryAddress?.address1}</p>
                                    <p>
                                      {order.deliveryAddress?.city}, {order.deliveryAddress?.state} {order.deliveryAddress?.zip}
                                    </p>
                                  </div>
                                </div>

                                <div className="mb-4">
                                  <p className="text-sm font-semibold text-gray-700 mb-1">Payment Method:</p>
                                  <p className="text-sm text-gray-600">
                                    {order.paymentMethod === 'card' ? '💳 Credit/Debit Card' : '💵 Cash on Delivery'}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Status Update Section */}
                            <div className="mt-6 border-t pt-4">
                              <h3 className="text-lg font-semibold text-gray-800 mb-3">Update Order Status</h3>
                              <div className="flex flex-wrap gap-2">
                                {['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(status => (
                                  <button
                                    key={status}
                                    onClick={() => updateOrderStatus(order._id, status)}
                                    disabled={updatingOrderId === order._id}
                                    className={`px-4 py-2 rounded font-medium transition-all text-sm ${
                                      order.orderStatus === status
                                        ? 'bg-red-600 text-white'
                                        : 'bg-gray-300 text-gray-700 hover:bg-gray-400 disabled:opacity-50'
                                    }`}
                                  >
                                    {updatingOrderId === order._id ? 'Updating...' : status.charAt(0).toUpperCase() + status.slice(1)}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
