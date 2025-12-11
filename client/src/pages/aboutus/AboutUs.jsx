import React from 'react';
import CoolChat from '../../components/chat/coolchat';
//import CoolChat from './CoolChat'; // adjust path if needed

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 px-6 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Our Mission Section */}
        <section className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
          <p className="text-base leading-relaxed">
            Since our launch, our mission has always been to simplify and modernize the spare parts industry by providing:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-700">
            <li>📞 Emergency contact connectivity during breakdowns or urgent roadside situations</li>
            <li>🚚 Real-time delivery partner coordination with live order tracking</li>
            <li>🧰 Smart search to find and book nearby garages when you need immediate help</li>
            <li>🛒 A vast selection of spare parts across multiple vehicle types and categories</li>
            <li>💳 Seamless, secure payment experiences through trusted gateway integrations</li>
          </ul>
        </section>

        {/* Why DriveFix Section */}
        <section className="bg-gradient-to-r from-orange-400 to-orange-300 text-white rounded-2xl shadow-md p-6 mb-16">
          <h2 className="text-2xl font-semibold mb-2">Why DriveFix?</h2>
          <p className="text-base leading-relaxed">
            Whether you're dealing with an unexpected breakdown, searching for rare spare parts, or coordinating fast delivery to your garage — DriveFix keeps you connected and in control. We're not just a parts provider; we're your reliable partner on every journey.
          </p>
        </section>

        {/* Live Chat Section */}
        <section className="flex flex-col items-center text-center space-y-6">
          <h2 className="text-3xl font-bold text-gray-800">Wanna Know More About Us.....Let's Chat</h2>
          <CoolChat/>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
