import React, { useState } from 'react';
import ProductHeader from '../../components/spareparts/ProductHeader';
import ProductGridCooling, { currentProducts } from "../../components/spareparts/ProductGridCooling";

const CoolingSystemViewDetailsPage = () => {
  const [view, setView] = useState('grid');

  return (
    <div className="p-4">
      <ProductHeader productCount={currentProducts.length} view={view} setView={setView} />
      <ProductGridCooling view={view} />
    </div>
  );
};

export default CoolingSystemViewDetailsPage;
