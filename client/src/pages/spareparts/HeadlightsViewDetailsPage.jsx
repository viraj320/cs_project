import React, { useState } from 'react';
import ProductHeader from '../../components/spareparts/ProductHeader';
import ProductGridHeadlight, { currentProducts } from "../../components/spareparts/ProductGridHeadlight";

const HeadlightsViewDetailsPage = () => {
  const [view, setView] = useState('grid');

  return (
    <div className="p-4">
      <ProductHeader productCount={currentProducts.length} view={view} setView={setView} />
      <ProductGridHeadlight view={view} />
    </div>
  );
};

export default HeadlightsViewDetailsPage;
