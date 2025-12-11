import React, { useState, useEffect, useContext } from 'react';
import { CartContext } from '../../context/CartContext';
import API from '../../services/api';

function FlashDeals() {
  const { addToCart } = useContext(CartContext);
  const [seconds, setSeconds] = useState(52); // 🔥 Start at 52

  const [deal, setDeal] = useState(null);
  const apiOrigin = API.defaults.baseURL?.replace(/\/api$/, '') || '';

  const resolveImage = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${apiOrigin}${path}`;
  };

  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get('/home-sections?section=flash');
        const items = Array.isArray(res.data?.data) ? res.data.data : [];
        setDeal(items[0] || null);
      } catch (err) {
        console.error('Failed to load flash deal', err);
        setDeal(null);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 59)); // 🔄 Decrease every second
    }, 1000);

    return () => clearInterval(interval); // 🧹 Cleanup on unmount
  }, []);

  return (
    <div className="w-full bg-color: #f5f5f5 py-10 px-4 md:px-16 flex flex-col md:flex-row items-center justify-center gap-10">
      
      {/* Tire Image Section */}
      <div className="w-auto bg-gray-100 rounded flex items-center justify-center">
        {resolveImage(deal?.image) ? (
          <img
            src={resolveImage(deal.image)}
            alt={deal.title}
            className="w-[280px] md:w-[350px] object-contain bg-gray-100"
          />
        ) : (
          <div className="w-[280px] md:w-[350px] h-[200px] bg-gray-200 flex items-center justify-center text-gray-500">
            No image
          </div>
        )}
      </div>

      {/* Deal Content */}
      <div className="text-center md:text-left">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">{deal?.title || 'FLASH DEALS'}</h2>
        <p className="text-xl text-gray-600 mb-5">{deal?.subtitle || 'HURRY UP AND GET 25% DISCOUNT'}</p>

        {/* CTA Button */}
        <button
          onClick={() => {
            if (!deal) return;
            const product = deal.product || {
              _id: deal._id,
              name: deal.title,
              price: deal.price || 0,
              image: deal.image,
            };
            addToCart(product, 1);
            alert('Added to cart');
          }}
          className="bg-orange-500 hover:bg-orange-600 transition text-white font-semibold py-2 px-6 rounded mb-6"
        >
          {deal?.buttonText || 'ADD TO CART'}
        </button>

        {/* Countdown Timer */}
        <div className="flex gap-4 justify-center md:justify-start">
          {[
            { value: '15', label: 'days' },
            { value: '10', label: 'hours' },
            { value: '24', label: 'min' },
          ].map((item, index) => (
            <div key={index} className="bg-gray-800 text-white px-4 py-2 rounded text-center">
              <div className="text-xl font-bold">{item.value}</div>
              <div className="text-sm">{item.label}</div>
            </div>
          ))}

          {/* 🔥 Only "sec" value dynamic */}
          <div className="bg-gray-800 text-white px-4 py-2 rounded text-center">
            <div className="text-xl font-bold">{seconds}</div>
            <div className="text-sm">sec</div>
          </div>

        </div>
      </div>

    </div>
  );
}

export default FlashDeals;
