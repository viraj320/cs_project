import React, { useState } from 'react';
import ProductHeader from '../../components/spareparts/ProductHeader';
import ProductGridFoglight, { currentProducts } from "../../components/spareparts/ProductGridFoglight";

const FoglightViewDetailsPage = () => {
  const [view, setView] = useState('grid');

  return (
    <div className="p-4">
      <ProductHeader productCount={currentProducts.length} view={view} setView={setView} />
      <ProductGridFoglight view={view} />
    </div>
  );
};

export default FoglightViewDetailsPage;
