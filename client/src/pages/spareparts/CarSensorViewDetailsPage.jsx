import React, { useState } from 'react';
import ProductHeader from '../../components/spareparts/ProductHeader';
import ProductGridCarSensor, { currentProducts } from "../../components/spareparts/ProductGridCarSensor";

const CarSensorViewDetailsPage = () => {
  const [view, setView] = useState('grid');

  return (
    <div className="p-4">
      <ProductHeader productCount={currentProducts.length} view={view} setView={setView} />
      <ProductGridCarSensor view={view} />
    </div>
  );
};

export default CarSensorViewDetailsPage;
