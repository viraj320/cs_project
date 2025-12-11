import React, { useState } from 'react';
import ProductHeader from '../../components/spareparts/ProductHeader';
import ProductGridFrontBumpers, { currentProducts } from "../../components/spareparts/ProductGridFrontBumpers";

const FrontBumpersViewDetailsPage = () => {
  const [view, setView] = useState('grid');

  return (
    <div className="p-4">
      <ProductHeader productCount={currentProducts.length} view={view} setView={setView} />
      <ProductGridFrontBumpers view={view} />
    </div>
  );
};

export default FrontBumpersViewDetailsPage;
