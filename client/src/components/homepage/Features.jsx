import React from 'react';

// Dummy icon imports (replace with your actual icons)
import deliverypartner from '../../assets/homepagefeatures/deliverypartner.jpeg';
import emergencyservice from '../../assets/homepagefeatures/emergencyservice.jpeg';
import garagelocator from '../../assets/homepagefeatures/garagelocator.jpeg';

// Card Component
const FeatureCard = ({ icon, title }) => {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="bg-white p-6 rounded-2xl shadow-md flex items-center justify-center w-24 h-24 mb-4 hover:shadow-lg transition">
        <img src={icon} alt={title} className="w-12 h-12 object-contain" />
      </div>
      <h3 className="text-base font-bold text-gray-800">{title}</h3>
    </div>
  );
};

const Features = () => {
  const features = [
    { icon: deliverypartner, title: 'Choose Delivery Partner' },
    { icon: emergencyservice, title: 'Emergency Partner' },
    { icon: garagelocator, title: 'Garage Locator' },
  ];

  return (
    <div className="bg-[#F8F9FC] py-16"> {/* Light background like your uploaded image */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <FeatureCard key={index} icon={feature.icon} title={feature.title} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
