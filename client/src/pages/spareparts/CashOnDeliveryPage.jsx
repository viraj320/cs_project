import React from "react";
import { useNavigate } from "react-router-dom";

const CashOnDeliveryPage = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded shadow-md max-w-xl w-full">
        <h1 className="text-2xl font-bold text-green-600 mb-4 text-center">
          ✅ Order Placed Successfully!
        </h1>
        <p className="text-gray-700 mb-6 text-center">
          You selected <strong>Cash on Delivery</strong>. Please keep the exact amount ready.
          Our delivery agent will collect payment upon delivery.
        </p>

        <div className="mb-6 text-gray-600 text-sm">
          <h2 className="font-semibold mb-2">What happens next?</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Your order is being processed.</li>
            <li>You will receive a confirmation email shortly.</li>
            <li>Tracking details will be shared once your order is shipped.</li>
            <li>Prepare the payment at delivery time.</li>
          </ul>
        </div>

        <div className="text-center">
          <button
            onClick={handleBackToHome}
            className="bg-blue-600 hover:bg-red-600 text-white font-medium py-2 px-6 rounded transition duration-300"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default CashOnDeliveryPage;
