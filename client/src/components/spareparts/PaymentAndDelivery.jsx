import React from 'react';
import PickmeLogo from '../../assets/sparepartspage/Pickme.jpeg'; // ✅ Import your Pickme.jpeg here

const PaymentAndDelivery = () => {
  return (
    <div className="flex flex-col items-center px-6 py-12">
      <div className="flex flex-col md:flex-row justify-center gap-20 w-full">

        {/* Payment Options Section */}
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-bold mb-2 text-center">Payment Options</h2>
          <div className="w-20 border-t-2 border-gray-300 mb-4"></div> {/* Grey underline */}
          <div className="flex justify-center gap-4">
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" className="h-8" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="MasterCard" className="h-8" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-8" />
          </div>
        </div>

        {/* Delivery Partners Section */}
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-bold mb-2 text-center">Delivery Partners</h2>
          <div className="w-24 border-t-2 border-gray-300 mb-4"></div> {/* Grey underline */}
          <div className="flex justify-center gap-4">
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="Uber" className="h-8" />
            <img src={PickmeLogo} alt="PickMe" className="h-10 object-contain" />
          </div>
        </div>

      </div>
    </div>
  );
};

export default PaymentAndDelivery;
