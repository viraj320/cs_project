import React, { useState } from 'react';
import ProductHeader from '../../components/spareparts/ProductHeader';
import ProductGridCarDoor, { currentProducts } from "../../components/spareparts/ProductGridCarDoor";

const CarDoorsViewDetailsPage = () => {
  const [view, setView] = useState('grid');

  return (
    <div className="p-4">
      <ProductHeader productCount={currentProducts.length} view={view} setView={setView} />
      <ProductGridCarDoor view={view} />
    </div>
  );
};

export default CarDoorsViewDetailsPage;
