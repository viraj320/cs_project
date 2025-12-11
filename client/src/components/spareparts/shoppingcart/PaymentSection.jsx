import React from "react";

const PaymentSection = ({ selectedMethod, setSelectedMethod }) => {
  return (
    <div className="bg-blue-50 pt-10 pb-10 px-6 rounded shadow w-full max-w-md">
      <h3 className="font-semibold text-lg">Payment Method</h3>
      <hr className="border-red-500 w-12 my-2" />
      <div className="flex flex-col gap-3 mb-4">
        {["card", "cod", "paypal"].map((method) => (
          <label key={method} className="flex gap-2 items-start">
            <input
              type="radio"
              name="paymentMethod"
              value={method}
              checked={selectedMethod === method}
              onChange={() => setSelectedMethod(method)}
              className="mt-1 accent-red-600"
            />
            <span>
              <span className="font-medium text-gray-800">
                {method === "card"
                  ? "Credit or Debit Card"
                  : method === "cod"
                  ? "Cash on Delivery"
                  : "PayPal"}
              </span>
              <br />
              {method === "card"
                ? "Pay securely using your Visa or MasterCard."
                : method === "cod"
                ? "Pay with cash upon receiving the order."
                : "Pay using your PayPal account."}
            </span>
          </label>
        ))}
      </div>

      <h3 className="font-semibold text-lg">Payment Instructions</h3>
      <hr className="border-red-500 w-12 my-2" />
      <p className="text-gray-800 mb-4">
        {selectedMethod === "card" && "Enter your card details at the next step after placing the order."}
        {selectedMethod === "cod" && "Ensure you have the exact amount ready. Our courier will collect payment upon delivery."}
        {selectedMethod === "paypal" && "You will be redirected to PayPal to complete the payment."}
      </p>

      <h3 className="font-semibold text-lg">Coupon Verification</h3>
      <hr className="border-red-500 w-12 my-2" />
      <div className="flex mt-2">
        <input type="text" placeholder="Enter coupon code" className="border rounded-l px-4 py-2 w-full text-sm" />
        <button className="bg-red-600 text-white text-xs px-4 py-2 rounded-r font-semibold hover:bg-red-700 whitespace-nowrap">
          APPLY COUPON
        </button>
      </div>
    </div>
  );
};

export default PaymentSection;