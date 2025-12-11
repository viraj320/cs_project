import React, { useState } from 'react';
import ProductHeader from '../../components/spareparts/ProductHeader';
import ProductGridBakers, { currentProducts } from "../../components/spareparts/ProductGridBakers";

const BrakersViewDetailsPage = () => {
  const [view, setView] = useState('grid');

  return (
    <div className="p-4">
      <ProductHeader productCount={currentProducts.length} view={view} setView={setView} />
      <ProductGridBakers view={view} />
    </div>
  );
};

export default BrakersViewDetailsPage;
