import React from 'react';
import { FaHeadset, FaAward, FaRocket } from 'react-icons/fa'; // Using professional icons

const WhyChooseUs = () => {
  const features = [
    {
      icon: <FaHeadset size={40} />,
      title: "Free Home Delivery",
      description: "Provide free home delivery for all product over $100",
    },
    {
      icon: <FaAward size={40} />,
      title: "Quality Products",
      description: "We ensure our product quality all times",
    },
    {
      icon: <FaRocket size={40} />,
      title: "Online Support",
      description: "To satisfy our customer we try to give support online",
    },
  ];

  return (
    <div className="py-16 bg-white text-center">
      <h2 className="text-4xl font-bold text-gray-800 mb-12">Why Choose Us?</h2>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex flex-col items-center p-8 bg-white rounded-lg shadow-md hover:shadow-lg transition border"
          >
            <div className="text-gray-700 mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyChooseUs;
