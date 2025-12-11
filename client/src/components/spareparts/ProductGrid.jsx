import React, { useState, useEffect,useContext } from 'react';
import { FaShoppingCart, FaImage } from 'react-icons/fa'; 
import { useNavigate } from 'react-router-dom';
import {CartContext} from "../../context/CartContext"
import axios from 'axios';
import Pagination from './Pagination';

const ProductGrid = ({ selectedCategoryId, filters = {} }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { addToCart } = useContext(CartContext);
  
  const productsPerPage = 5;
  const navigate = useNavigate(); 

  useEffect(() => {
    if (selectedCategoryId) {
      fetchProducts(selectedCategoryId);
    } else {
      setProducts([]);
      setFilteredProducts([]);
    }
  }, [selectedCategoryId]);

  // Apply filters whenever filter selection changes
  useEffect(() => {
    applyFilters();
    setCurrentPage(1);
  }, [filters, products]);

  const fetchProducts = async (categoryId) => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/spare-parts/category/${categoryId}`
      );
      setProducts(data);
      setError("");
    } catch (e) {
      setError("Failed to load products");
      setProducts([]);
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...products];

    // Filter by Product Grade
    if (filters.productGrade && filters.productGrade.length > 0) {
      result = result.filter((p) => filters.productGrade.includes(p.productGrade));
    }

    // Filter by Fitment
    if (filters.fitment && filters.fitment.length > 0) {
      result = result.filter((p) => filters.fitment.includes(p.fitment));
    }

    // Filter by Brand
    if (filters.brand && filters.brand.length > 0) {
      result = result.filter((p) => 
        p.specifications?.brand && filters.brand.includes(p.specifications.brand)
      );
    }

    // Filter by Price Range
    if (filters.priceRange && filters.priceRange.length > 0) {
      result = result.filter((p) => {
        const price = p.price || 0;
        return filters.priceRange.some((range) => {
          if (range === '$0 - $50') return price <= 50;
          if (range === '$51 - $100') return price > 50 && price <= 100;
          if (range === '$101 - $200') return price > 100 && price <= 200;
          if (range === '$201 - $500') return price > 200 && price <= 500;
          if (range === '$500+') return price > 500;
          return false;
        });
      });
    }

    // Filter by Availability
    if (filters.availability && filters.availability.length > 0) {
      result = result.filter((p) => filters.availability.includes(p.availability));
    }

    setFilteredProducts(result);
  };

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

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

  if (!selectedCategoryId) {
    return (
      <div className="flex flex-col px-8 py-8">
        <div className="text-center text-gray-500">Select a category to view products</div>
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

  if (filteredProducts.length === 0) {
    return (
      <div className="flex flex-col px-8 py-8">
        <div className="text-center text-gray-500">No products match the selected filters</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col px-8">
      <div className="text-sm text-gray-600 mb-4">
        Showing {currentProducts.length > 0 ? startIndex + 1 : 0} - {Math.min(startIndex + productsPerPage, filteredProducts.length)} of {filteredProducts.length} products
      </div>
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
                    <FaImage size={32} />
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
                  onClick={() => addToCart(product, 1)}
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
