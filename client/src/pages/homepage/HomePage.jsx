import React, { useRef, useEffect } from 'react';
import FlashDeals from '../../components/homepage/FlashDeals';
import NewParts from '../../components/homepage/NewParts';
import CustomerReviews from '../../components/homepage/CustomerReviews';
import Article from '../../components/homepage/Article';
import BestSellers from '../../components/homepage/BestSellers';
import MembershipDiscount from '../../components/homepage/MembershipDiscount';
import WhyChooseUs from '../../components/homepage/WhyChooseUs';
import ContactUs from '../../components/homepage/ContactUs';
import Features from '../../components/homepage/Features';

function HomePage() {
  const contactRef = useRef(null);

  // Make it globally accessible
  useEffect(() => {
    window.scrollToContact = () => {
      contactRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
  }, []);

  return (
    <div className="w-full">
      {/* Video Banner Section */}
      <div className="relative h-[400px] w-full overflow-hidden">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover"
          src="/videos/homepagevedio.mp4"
          autoPlay
          muted
          loop
          playsInline
        ></video>
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 z-10" />
        <div className="relative z-20 flex flex-col justify-center items-center h-full px-4 text-center">
          <h1 className="text-white text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            Welcome to Smart Vehicle Spare Parts
          </h1>
          <p className="text-white text-lg md:text-xl max-w-xl drop-shadow-md">
            Your one-stop solution for reliable spare parts and expert vehicle services.
          </p>
        </div>
      </div>

      {/* Sections */}
      <FlashDeals />
      <NewParts />
      <CustomerReviews />
      <Article />
      <BestSellers />
      <MembershipDiscount />
      <WhyChooseUs />
      <Features />

      {/*  ContactUs with ref */}
      <div ref={contactRef}>
        <ContactUs />
      </div>
    </div>
  );
}

export default HomePage;
