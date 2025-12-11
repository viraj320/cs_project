import React, { useState, useEffect } from 'react';
import { FaShoppingCart } from 'react-icons/fa'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Pagination from './Pagination';

const ProductGrid = ({ selectedCategoryId }) => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const productsPerPage = 5;
  const navigate = useNavigate(); 

  useEffect(() => {
    if (selectedCategoryId) {
      fetchProducts(selectedCategoryId);
    }
  }, [selectedCategoryId]);

  const fetchProducts = async (categoryId) => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/spare-parts/category/${categoryId}`
      );
      setProducts(data);
      setCurrentPage(1);
      setError("");
    } catch (e) {
      setError("Failed to load products");
      setProducts([]);
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(products.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + productsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleViewDetails = (product) => {
    navigate('/view-details', { state: { product } });
  };

  if (loading) {
    return (
      <div className="flex flex-col px-8 py-8">
        <div className="text-center text-gray-600">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col px-8 py-8">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col px-8 py-8">
        <div className="text-center text-gray-500">No products available in this category</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col px-8">
      <div className="flex flex-col gap-6">
        {currentProducts.map((product) => (
          <div 
            key={product._id} 
            className="flex flex-col md:flex-row items-center justify-between border rounded-lg shadow p-4 hover:shadow-lg transition-shadow"
          >
            {/* Product Image */}
            <div className="flex flex-col items-center w-32 h-45 mb-4 md:mb-0">
              <h3 className="text-md font-semibold truncate max-w-[120px] mb-4 text-center">
                {product.name}
              </h3>
              <div className="w-full h-full flex justify-center items-center">
                {product.image ? (
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="h-24 object-contain rounded border" 
                  />
                ) : (
                  <div className="h-24 w-24 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>
            </div>

            {/* Product Details */}
            <div className="flex-1 md:ml-6 text-center md:text-left px-4">
              {product.specifications?.brand && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Brand:</span> {product.specifications.brand}
                </p>
              )}
              {product.specifications?.model && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Model:</span> {product.specifications.model}
                </p>
              )}
              {product.specifications?.compatibility && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Compatibility:</span> {product.specifications.compatibility}
                </p>
              )}
              {product.price && (
                <p className="text-lg font-semibold text-blue-600 mt-2">
                  Rs {product.price}
                </p>
              )}
              {product.quantity !== undefined && (
                <p className="text-sm text-gray-500">
                  {product.quantity > 0 ? `In Stock: ${product.quantity}` : 'Out of Stock'}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex gap-2 items-center">
                <button
                  onClick={() => handleViewDetails(product)}
                  className="flex items-center justify-center px-4 py-2 border border-blue-400 text-blue-600 rounded-full hover:bg-blue-50 transition"
                >
                  View Details
                </button>
                
                <button
                  className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
                  title="Add to Cart"
                >
                  <FaShoppingCart />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default ProductGrid;
