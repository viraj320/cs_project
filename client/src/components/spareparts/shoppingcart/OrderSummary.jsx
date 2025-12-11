import React from "react";
import { useNavigate } from "react-router-dom";

const OrderSummary = ({ totalPrice, handleShippingMethodChange }) => {
  const navigate = useNavigate();

  const handleProceedToCheckout = () => {
    navigate("/checkout"); //  Navigate to Checkout page
  };

  return (
    <div className="w-full md:w-1/3 mt-6 md:mt-0">
      <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
      <div className="bg-white shadow-md rounded-lg p-4">
        <p className="text-gray-600">Subtotal: LKR {totalPrice.toLocaleString()}</p>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Shipping Method</label>
          <div className="mt-2">
            <label className="inline-flex items-center mr-4">
              <input
                type="radio"
                name="shipping-method"
                value="local-pickup"
                defaultChecked
                onChange={handleShippingMethodChange}
                className="form-radio"
              />
              <span className="ml-2">Local Pickup (Free)</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="shipping-method"
                value="flat-rate"
                onChange={handleShippingMethodChange}
                className="form-radio"
              />
              <span className="ml-2">Flat Rate (LKR 300)</span>
            </label>
          </div>
        </div>
        <p className="text-xl font-semibold mt-4">
          Total: LKR {totalPrice + 300}
        </p>
        <button
          onClick={handleProceedToCheckout}
          className="w-full mt-6 py-2 px-4 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;
