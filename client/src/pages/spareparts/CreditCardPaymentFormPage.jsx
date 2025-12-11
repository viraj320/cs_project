import React, { useState } from "react";

const CreditCardPaymentFormPage = () => {
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    nameOnCard: "",
    acceptedTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const cardNumberRegex = /^\d{16}$/;
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    const cvvRegex = /^\d{3}$/;

    if (!cardNumberRegex.test(formData.cardNumber)) {
      alert("Card number must be 16 digits.");
      return;
    }

    if (!expiryRegex.test(formData.expiry)) {
      alert("Expiry date must be in MM/YY format.");
      return;
    }

    if (!cvvRegex.test(formData.cvv)) {
      alert("CVV must be exactly 3 digits.");
      return;
    }

    if (!formData.nameOnCard.trim()) {
      alert("Please enter the name on the card.");
      return;
    }

    if (!formData.acceptedTerms) {
      alert("You must accept the terms and conditions.");
      return;
    }

    alert("Payment submitted successfully!");
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 max-w-lg mx-auto border border-gray-200">
      {/* Header */}
      <h2 className="text-xl font-bold text-gray-800 mb-4">PAYMENT METHOD</h2>

      <form onSubmit={handleSubmit}>
        {/* Credit/Debit Card Section */}
        <div className="border border-gray-300 rounded p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-gray-800">CREDIT / DEBIT CARD</h3>
            <div className="flex gap-2">
              <img src="https://img.icons8.com/color/32/000000/visa.png" alt="Visa" />
              <img src="https://img.icons8.com/color/32/000000/mastercard.png" alt="Mastercard" />
              <img src="https://img.icons8.com/color/32/000000/amex.png" alt="Amex" />
            </div>
          </div>

          <p className="text-sm text-gray-500 mb-4">
            You may be directed to your bank's 3D secure process to authenticate your information.
          </p>

          {/* Card Number */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Card number</label>
            <input
              type="text"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleChange}
              placeholder="1234123412341234"
              maxLength={16}
              className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Expiry Date and CVV */}
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiry date</label>
              <input
                type="text"
                name="expiry"
                value={formData.expiry}
                onChange={handleChange}
                placeholder="MM/YY"
                className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CVC / CVV</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleChange}
                  placeholder="123"
                  maxLength={3}
                  className="w-24 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <span className="text-xs text-gray-500">ⓘ 3 digits</span>
              </div>
            </div>
          </div>

          {/* Name on Card */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Name on card</label>
            <input
              type="text"
              name="nameOnCard"
              value={formData.nameOnCard}
              onChange={handleChange}
              placeholder="Samanta Smith"
              className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Terms & Conditions */}
          <div className="mb-4">
            <label className="inline-flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                name="acceptedTerms"
                checked={formData.acceptedTerms}
                onChange={handleChange}
                className="mt-1"
              />
              I have read and accept the terms of use, rules of flight and privacy policy
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-500 text-blue-700 font-bold py-2 rounded hover:bg-red-500 hover:text-red-100 transition duration-300"
          >
            Pay Now »
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreditCardPaymentFormPage;
