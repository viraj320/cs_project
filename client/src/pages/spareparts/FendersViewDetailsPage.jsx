import React, { useState } from 'react';
import ProductHeader from '../../components/spareparts/ProductHeader';
import ProductGridFender, { currentProducts } from "../../components/spareparts/ProductGridFender";

const FenderViewDetailsPage = () => {
  const [view, setView] = useState('grid');

  return (
    <div className="p-4">
      <ProductHeader productCount={currentProducts.length} view={view} setView={setView} />
      <ProductGridFender view={view} />
    </div>
  );
};

export default FenderViewDetailsPage;
