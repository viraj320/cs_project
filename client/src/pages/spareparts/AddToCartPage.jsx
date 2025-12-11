import React, { useState } from 'react';
import { useParams } from 'react-router-dom';  
import { currentProducts } from "../../components/spareparts/ProductGridBakers";
import ShoppingCartDrawer from '../../components/spareparts/shoppingcart/ShoppingCartDrawer';

const AddToCartPage = () => {
  const { id } = useParams();  // Get product ID from URL
  const product = currentProducts.find(p => p.id === parseInt(id));  // Find product by ID
  const [quantity, setQuantity] = useState(1);  // Quantity of product added to cart
  const [size, setSize] = useState('');  // Size of the product selected
  const [wishlisted, setWishlisted] = useState(false);  // Wishlist status
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);  // Sidebar visibility state

  // Handle Add to Cart button click
  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent default behavior (form submission or link navigation)
    setIsSidebarVisible(true);  // Show the sidebar when "Add to Cart" is clicked
  };

  // Handle Sidebar Close
  const handleCloseSidebar = () => {
    setIsSidebarVisible(false);  // Close the sidebar when the close button is clicked
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      {/* Product Code */}
      <p className="text-sm text-gray-600 mb-2">
        <strong>Product Code:</strong> <span className="text-gray-700">#BKR5E-11</span>
      </p>

      {/* Tags */}
      <p className="mb-4 text-sm">
        <span className="font-medium">Tags:</span>{" "}
        <span className="text-red-500">NGK Genuine Spark Plug</span>
      </p>

      {/* Stock */}
      <p className="text-green-600 font-medium mb-2">In stock</p>

      {/* Price */}
      <p className="text-red-600 text-2xl font-bold mb-6">LKR 2,950.00</p>

      {/* Size Dropdown */}
      <div className="mb-6">
        <label className="block mb-1 text-sm font-semibold">
          Size <span className="text-red-500">*</span>
        </label>
        <select
          value={size}
          onChange={(e) => setSize(e.target.value)}
          className="w-64 border rounded px-4 py-2 text-sm"
        >
          <option value="">Choose an option</option>
          <option value="small">Small</option>
          <option value="standard">Standard</option>
          <option value="large">Large</option>
        </select>
      </div>

      {/* Quantity & Add to Cart */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex items-center border rounded overflow-hidden">
          <button
            onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200"
          >–</button>
          <span className="px-5">{quantity}</span>
          <button
            onClick={() => setQuantity((prev) => prev + 1)}
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200"
          >+</button>
        </div>
        <button
          onClick={handleAddToCart} // Trigger sidebar visibility on click
          className="border border-red-600 text-red-600 px-6 py-2 rounded hover:bg-red-600 hover:text-white transition text-sm font-semibold"
        >
          🛒 ADD TO CART
        </button>
      </div>

      {/* Wishlist */}
      <div className="flex gap-8 text-sm font-semibold text-gray-600 mb-6">
        <button
          onClick={() => setWishlisted(!wishlisted)}
          className="flex items-center gap-2 outline-none"
        >
          <span className={`${wishlisted ? "text-red-600" : "text-gray-500"} text-2xl`}>
            {wishlisted ? "♥" : "♡"}
          </span>
          <span className="text-gray-700 text-base">Wishlist</span>
        </button>
      </div>

      {/* Sidebar Cart */}
      <ShoppingCartDrawer
        isSidebarVisible={isSidebarVisible} 
        product={product} 
        quantity={quantity} 
        handleCloseSidebar={handleCloseSidebar} 
      />
    </div>
  );
};

export default AddToCartPage;
