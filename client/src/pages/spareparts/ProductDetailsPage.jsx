import React, { useState, useContext, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaImage, FaShoppingCart, FaCheck } from 'react-icons/fa';
import { CartContext } from '../../context/CartContext';
import API from '../../services/api';

const ProductDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const product = location.state?.product;

  const apiOrigin = API.defaults.baseURL?.replace(/\/api$/, '') || '';
  const resolveImage = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${apiOrigin}${path}`;
  };

  const displayProduct = useMemo(() => {
    if (!product) return null;
    return { ...product, image: resolveImage(product.image) };
  }, [product]);

  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  if (!displayProduct) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-500 mb-4">Product not found</p>
        <button
          onClick={() => navigate('/spareparts')}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <FaArrowLeft /> Back to Products
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (displayProduct && quantity > 0) {
      addToCart(displayProduct, quantity);
      setAddedToCart(true);
      setTimeout(() => {
        setAddedToCart(false);
        // Optionally navigate to cart after 2 seconds
        // navigate('/view-cart');
      }, 2000);
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) setQuantity(value);
  };

  const incrementQuantity = () => {
    if (quantity < (displayProduct.quantity || 999)) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  const inStock = (displayProduct.quantity || 0) > 0;
  const totalPrice = (displayProduct.price || 0) * quantity;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate('/spareparts')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <FaArrowLeft /> Back to Products
        </button>

        {/* Product Details Container */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Left Side - Product Image */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center mb-4 border border-gray-200">
                {displayProduct.image ? (
                  <img
                    src={displayProduct.image}
                    alt={displayProduct.name}
                    className="w-full h-full object-contain p-4"
                  />
                ) : (
                  <div className="flex items-center justify-center text-gray-400">
                    <FaImage size={80} />
                  </div>
                )}
              </div>
              {/* Badge */}
              <div className="w-full">
                {displayProduct.availability === 'In Stock' ? (
                  <div className="bg-green-100 text-green-700 px-4 py-2 rounded text-center font-semibold">
                    ✓ In Stock
                  </div>
                ) : (
                  <div className="bg-red-100 text-red-700 px-4 py-2 rounded text-center font-semibold">
                    Out of Stock
                  </div>
                )}
              </div>
            </div>

            {/* Right Side - Product Info */}
            <div className="flex flex-col justify-between">
              {/* Title and Basic Info */}
              <div>
                <h1 className="text-4xl font-bold text-gray-800 mb-2">{displayProduct.name}</h1>
                
                {/* Product Grade and Fitment */}
                <div className="flex gap-4 mb-4">
                  {displayProduct.productGrade && (
                    <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                      {displayProduct.productGrade}
                    </span>
                  )}
                  {displayProduct.fitment && (
                    <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                      {displayProduct.fitment}
                    </span>
                  )}
                </div>

                {/* Price */}
                <div className="mb-6">
                  <p className="text-5xl font-bold text-blue-600 mb-2">Rs {displayProduct.price || '0.00'}</p>
                  <p className="text-sm text-gray-500">incl. VAT 0% | excl. shipping costs</p>
                </div>

                {/* Description */}
                {displayProduct.description && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                    <p className="text-gray-600 line-clamp-3">{displayProduct.description}</p>
                  </div>
                )}

                {/* Specifications */}
                <div className="mb-6 border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Specifications</h3>
                  <div className="space-y-3">
                    {displayProduct.specifications?.brand && (
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600 font-medium">Brand:</span>
                        <span className="text-gray-800 font-semibold">{displayProduct.specifications.brand}</span>
                      </div>
                    )}
                    {displayProduct.specifications?.model && (
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600 font-medium">Model:</span>
                        <span className="text-gray-800 font-semibold">{displayProduct.specifications.model}</span>
                      </div>
                    )}
                    {displayProduct.specifications?.compatibility && (
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600 font-medium">Compatibility:</span>
                        <span className="text-gray-800 font-semibold">{displayProduct.specifications.compatibility}</span>
                      </div>
                    )}
                    {displayProduct.specifications?.warranty && (
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600 font-medium">Warranty:</span>
                        <span className="text-gray-800 font-semibold">{displayProduct.specifications.warranty}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Info */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <p className="text-sm text-gray-700 mb-2">
                    <span className="font-semibold">Available Quantity:</span> {displayProduct.quantity || 0} units
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Availability:</span> {displayProduct.availability || 'Unknown'}
                  </p>
                </div>
              </div>

              {/* Add to Cart Section */}
              <div className="border-t pt-6">
                <div className="flex items-center gap-4 mb-6">
                  <label className="text-lg font-semibold text-gray-800">Quantity:</label>
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="w-16 text-center border-l border-r py-2 focus:outline-none"
                      min="1"
                      max={displayProduct.quantity || 999}
                    />
                    <button
                      onClick={incrementQuantity}
                      disabled={quantity >= (displayProduct.quantity || 999)}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Price Summary */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">Subtotal:</span>
                    <span className="text-2xl font-bold text-blue-600">Rs {totalPrice.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-gray-600">incl. VAT 0% | excl. shipping costs</p>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={!inStock}
                  className={`w-full py-3 px-4 rounded-lg font-semibold text-lg flex items-center justify-center gap-2 transition ${
                    inStock
                      ? addedToCart
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  }`}
                >
                  {addedToCart ? (
                    <>
                      <FaCheck /> Added to Cart!
                    </>
                  ) : (
                    <>
                      <FaShoppingCart /> Add to Cart
                    </>
                  )}
                </button>

                {!inStock && (
                  <p className="text-center text-red-600 font-semibold mt-3">
                    This product is currently out of stock
                  </p>
                )}

                {/* Delivery Info */}
                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <FaCheck className="text-green-600" />
                    </div>
                    <p className="text-sm text-gray-700">Ready for dispatch</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    Shipping costs and delivery times may vary depending on your location
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section (Optional) */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Continue Shopping</h2>
          <button
            onClick={() => navigate('/spareparts')}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            View All Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
