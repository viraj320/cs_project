import React, { useState } from 'react';
import ProductHeader from '../../components/spareparts/ProductHeader';
import ProductGridBumper, { currentProducts } from "../../components/spareparts/ProductGridBumper";

const BumperGrillsViewDetailsPage = () => {
  const [view, setView] = useState('grid');

  return (
    <div className="p-4">
      <ProductHeader productCount={currentProducts.length} view={view} setView={setView} />
      <ProductGridBumper view={view} />
    </div>
  );
};

export default BumperGrillsViewDetailsPage;
