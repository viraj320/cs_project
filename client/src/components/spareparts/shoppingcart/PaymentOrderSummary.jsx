import React, { useState } from "react";
import { getLocationName } from '../../../utils/deliveryFees';

const PaymentOrderSummary = ({ 
  cartItems = [], 
  subtotal = 0,
  deliveryFee = 0,
  total = 0,
  selectedLocation = 'colombo',
  agreed, 
  setAgreed, 
  onPlaceOrder 
}) => {
  return (
    <div className="bg-gray-100 p-6 rounded shadow">
      <h2 className="text-lg font-semibold">Order Summary</h2>
      <hr className="border-red-500 w-12 my-2" />

      {/* Cart Items Summary */}
      <div className="mb-4 max-h-48 overflow-y-auto">
        {cartItems && cartItems.length > 0 ? (
          <div>
            <p className="text-sm text-gray-600 mb-2">Items ({cartItems.length}):</p>
            <div className="space-y-2">
              {cartItems.map((item) => (
                <div key={item._id} className="flex justify-between text-sm bg-white p-2 rounded">
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium truncate">{item.name}</p>
                    <p className="text-xs text-gray-600">
                      {item.quantity} × LKR {item.price?.toLocaleString()}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-800 ml-2">
                    LKR {(item.price * item.quantity)?.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-600">No items in cart</p>
        )}
      </div>

      <hr className="my-3" />

      {/* Pricing Breakdown */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-800">Subtotal</span>
          <span className="font-semibold">LKR {subtotal?.toLocaleString()}</span>
        </div>

        <div className="flex justify-between text-sm">
          <div>
            <span className="text-gray-800">Delivery Fee</span>
            <p className="text-xs text-gray-600">{getLocationName(selectedLocation)}</p>
          </div>
          <span className="font-semibold">
            {deliveryFee === 0 ? "FREE" : `LKR ${deliveryFee?.toLocaleString()}`}
          </span>
        </div>
      </div>

      <hr className="my-3 border-2 border-gray-300" />

      {/* Total */}
      <div className="flex justify-between items-center text-xl font-semibold mb-4">
        <span>Total</span>
        <span className="text-red-600">LKR {total?.toLocaleString()}</span>
      </div>

      {/* Terms & Conditions */}
      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          className="mr-2 w-4 h-4 cursor-pointer"
          checked={agreed}
          onChange={() => setAgreed(!agreed)}
        />
        <label className="text-sm cursor-pointer">
          I agree to the <span className="text-red-600 font-medium">Terms & Conditions</span>
        </label>
      </div>

      {/* Place Order Button */}
      <button
        onClick={onPlaceOrder}
        disabled={!agreed || (cartItems && cartItems.length === 0)}
        className={`w-full py-3 rounded font-semibold transition-colors duration-300 text-white ${
          agreed && (cartItems && cartItems.length > 0)
            ? "bg-red-600 hover:bg-red-700 cursor-pointer" 
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        PLACE ORDER
      </button>

      {/* Info Note */}
      <p className="text-xs text-gray-600 mt-3 text-center">
        {deliveryFee === 0 
          ? "✓ Free delivery to Colombo (Our warehouse location)" 
          : `Delivery to ${getLocationName(selectedLocation)}`}
      </p>
    </div>
  );
};

export default PaymentOrderSummary;
