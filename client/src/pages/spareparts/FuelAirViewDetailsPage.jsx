import React, { useState } from 'react';
import ProductHeader from '../../components/spareparts/ProductHeader';
import ProductGridFuelAir, { currentProducts } from "../../components/spareparts/ProductGridFuelAir";

const FuelAirViewDetailsPage = () => {
  const [view, setView] = useState('grid');

  return (
    <div className="p-4">
      <ProductHeader productCount={currentProducts.length} view={view} setView={setView} />
      <ProductGridFuelAir view={view} />
    </div>
  );
};

export default FuelAirViewDetailsPage;
