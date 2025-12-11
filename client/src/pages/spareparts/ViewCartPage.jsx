import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import CartItem from "../../components/spareparts/shoppingcart/CartItem";
import OrderSummary from "../../components/spareparts/shoppingcart/OrderSummary";
import StepIndicator from '../../components/spareparts/shoppingcart/StepIndicator';
import { FaArrowLeft } from 'react-icons/fa';

const ViewCartPage = () => {
  const navigate = useNavigate();
  const { cartItems, updateCartItemQuantity, removeFromCart, getTotalPrice } = useContext(CartContext);
  const [shippingMethod, setShippingMethod] = useState('local-pickup');

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity > 0) {
      updateCartItemQuantity(productId, newQuantity);
    }
  };

  const handleShippingMethodChange = (e) => {
    setShippingMethod(e.target.value);
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
  };

  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };

  const totalPrice = getTotalPrice();
  const shippingCost = shippingMethod === 'flat-rate' ? 300 : 0;

  return (
    <div className="container mx-auto p-6">
      <button
        onClick={() => navigate('/spareparts')}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
      >
        <FaArrowLeft /> Back to Shopping
      </button>

      <StepIndicator activeStep={1} /> {/* Step 1 for ViewCartPage */}

      <div className="flex flex-col md:flex-row justify-between items-start gap-8">
        {/* Left Side - Cart Items */}
        <div className="w-full md:w-2/3">
          <h2 className="text-3xl font-semibold mb-4">Shopping Cart</h2>
          <div className="bg-white shadow-md rounded-lg p-6">
            {cartItems && cartItems.length > 0 ? (
              <div>
                <div className="mb-4 text-sm text-gray-600">
                  {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in cart
                </div>
                {cartItems.map((item) => (
                  <div key={item._id} className="flex items-center justify-between mb-6 border-b pb-6">
                    <div className="flex items-center gap-4 flex-1">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-24 h-24 object-cover rounded border border-gray-200"
                          />
                        ) : (
                          <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center text-gray-400 border border-gray-200">
                            No Image
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                        {item.specifications?.brand && (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Brand:</span> {item.specifications.brand}
                          </p>
                        )}
                        {item.specifications?.model && (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Model:</span> {item.specifications.model}
                          </p>
                        )}
                        <p className="text-sm text-gray-600 mt-1">
                          Unit Price: <span className="font-semibold">LKR {item.price?.toLocaleString()}</span>
                        </p>
                      </div>
                    </div>

                    {/* Quantity and Actions */}
                    <div className="flex flex-col items-end gap-3">
                      <div className="flex items-center border rounded-lg">
                        <button
                          onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item._id, parseInt(e.target.value) || 1)}
                          className="w-12 text-center border-l border-r py-1 focus:outline-none"
                          min="1"
                        />
                        <button
                          onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                      <p className="text-lg font-semibold text-blue-600">
                        LKR {(item.price * item.quantity)?.toLocaleString()}
                      </p>
                      <button
                        onClick={() => handleRemoveItem(item._id)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-gray-500 mb-4">Your cart is empty</p>
                <button
                  onClick={() => navigate('/spareparts')}
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Order Summary */}
        {cartItems && cartItems.length > 0 && (
          <div className="w-full md:w-1/3 mt-6 md:mt-0">
            <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
            <div className="bg-white shadow-md rounded-lg p-6">
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold">LKR {totalPrice.toLocaleString()}</span>
                </div>
              </div>

              {/* Shipping Method */}
              <div className="mb-6 pb-6 border-b">
                <label className="block text-sm font-medium text-gray-700 mb-3">Shipping Method</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="shipping-method"
                      value="local-pickup"
                      checked={shippingMethod === 'local-pickup'}
                      onChange={handleShippingMethodChange}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Local Pickup (Free)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="shipping-method"
                      value="flat-rate"
                      checked={shippingMethod === 'flat-rate'}
                      onChange={handleShippingMethodChange}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Flat Rate (LKR 300)</span>
                  </label>
                </div>
              </div>

              {/* Shipping Cost */}
              <div className="flex justify-between mb-4">
                <span className="text-gray-600">Shipping:</span>
                <span className="font-semibold">LKR {shippingCost.toLocaleString()}</span>
              </div>

              {/* Total */}
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-800">Total:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    LKR {(totalPrice + shippingCost).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3 px-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
              >
                Proceed to Checkout
              </button>

              {/* Continue Shopping */}
              <button
                onClick={() => navigate('/spareparts')}
                className="w-full py-3 px-4 mt-3 bg-white border-2 border-gray-300 text-gray-800 font-semibold rounded-lg hover:border-gray-400 transition"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewCartPage;
