import React, { useState } from 'react';
import CategoryTree from '../../components/spareparts/CategoryTree';
import FilterSidebar from '../../components/spareparts/FilterSidebar';
import ProductGrid from '../../components/spareparts/ProductGrid';
import PaymentAndDelivery from '../../components/spareparts/PaymentAndDelivery';
import FeedbackButton from '../../components/spareparts/FeedbackButton';
import FeedbackPopup from '../../components/spareparts/FeedbackPopup';

const SparePartsPage = () => {
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({
    productGrade: [],
    fitment: [],
    brand: [],
    priceRange: [],
    availability: [],
  });

  return (
    <div className="flex flex-col min-h-screen relative">

      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-6 px-8 pb-6">
        <div className="w-full md:w-1/4">
          <CategoryTree onSelectCategory={setSelectedCategoryId} />
        </div>
        <div className="flex-1">
          <ProductGrid 
            selectedCategoryId={selectedCategoryId} 
            filters={selectedFilters}
          />
        </div>
        <div className="w-full md:w-1/4">
          <FilterSidebar 
            selectedCategoryId={selectedCategoryId}
            onFiltersChange={setSelectedFilters}
          />
        </div>
      </div>

      {/* Bottom Section */}
      <PaymentAndDelivery />

      {/* Feedback Button */}
      <FeedbackButton onClick={() => setShowFeedbackPopup(true)} />

      {/* Feedback Popup */}
      {showFeedbackPopup && (
        <FeedbackPopup onClose={() => setShowFeedbackPopup(false)} />
      )}
    </div>
  );
};

export default SparePartsPage;
