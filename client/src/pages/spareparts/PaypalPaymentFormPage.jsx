import React from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const PaypalPaymentFormPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-center text-xl font-bold mb-4">Pay with PayPal</h2>
        
        <PayPalScriptProvider options={{ "client-id": "test", currency: "USD" }}>
          <PayPalButtons
            style={{ layout: "vertical" }}
            createOrder={(data, actions) => {
              return actions.order.create({
                purchase_units: [{
                  amount: {
                    value: "44.00", // Adjust as needed
                  },
                }],
              });
            }}
            onApprove={(data, actions) => {
              return actions.order.capture().then((details) => {
                alert(`Transaction completed by ${details.payer.name.given_name}`);
              });
            }}
          />
        </PayPalScriptProvider>
      </div>
    </div>
  );
};

export default PaypalPaymentFormPage;
