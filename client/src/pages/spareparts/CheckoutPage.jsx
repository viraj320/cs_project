import React, { useRef, useState, useContext } from 'react';
import CheckoutForm from '../../components/spareparts/shoppingcart/CheckoutForm';
import PaymentSection from '../../components/spareparts/shoppingcart/PaymentSection';
import PaymentOrderSummary from '../../components/spareparts/shoppingcart/PaymentOrderSummary';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { getDeliveryFee } from '../../utils/deliveryFees';
import axios from 'axios';

function CheckoutPage() {
  const formRef = useRef();
  const navigate = useNavigate();
  const { cartItems, getTotalPrice } = useContext(CartContext);
  
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [agreed, setAgreed] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('colombo');
  const [formDataState, setFormDataState] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Calculate totals
  const subtotal = getTotalPrice();
  const deliveryFee = getDeliveryFee(selectedLocation);
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = () => {
    if (!agreed) {
      alert("You must agree to the Terms & Conditions.");
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty. Please add items before checkout.");
      return;
    }

    if (formRef.current?.validateForm()) {
      if (paymentMethod === "card") {
        navigate("/order-completecredit", {
          state: {
            items: cartItems,
            subtotal,
            deliveryFee,
            total,
            selectedLocation,
            formData: formDataState,
          }
        });
      } else if (paymentMethod === "paypal") {
        navigate("/order-completepaypal", {
          state: {
            items: cartItems,
            subtotal,
            deliveryFee,
            total,
            selectedLocation,
            formData: formDataState,
          }
        });
      } else if (paymentMethod === "cod") {
        navigate("/order-completecash", {
          state: {
            items: cartItems,
            subtotal,
            deliveryFee,
            total,
            selectedLocation,
            formData: formDataState,
            paymentMethod: 'cod'
          }
        });
      } else {
        alert("Please select a valid payment method.");
      }
    } else {
      alert("Please fill in all required fields.");
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto my-8 text-center py-12">
        <p className="text-xl text-gray-600 mb-4">Your cart is empty</p>
        <button
          onClick={() => navigate('/spareparts')}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto my-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <CheckoutForm 
            ref={formRef} 
            selectedLocation={selectedLocation}
            onLocationChange={setSelectedLocation}
            onFormDataChange={setFormDataState}
          />
        </div>
        <div className="flex flex-col gap-4">
          <PaymentSection
            selectedMethod={paymentMethod}
            setSelectedMethod={setPaymentMethod}
          />
          <PaymentOrderSummary
            cartItems={cartItems}
            subtotal={subtotal}
            deliveryFee={deliveryFee}
            total={total}
            selectedLocation={selectedLocation}
            agreed={agreed}
            setAgreed={setAgreed}
            onPlaceOrder={handlePlaceOrder}
          />
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
