import React, { useContext } from 'react';
import { X } from 'lucide-react';
import { FiShoppingCart } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../../context/CartContext';

const ShoppingCartDrawer = ({ isSidebarVisible, handleCloseSidebar }) => {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, removeFromCart } = useContext(CartContext);

  const totalPrice = getTotalPrice();
  const itemCount = cartItems.length;

  const handleViewCart = () => {
    handleCloseSidebar();
    navigate("/view-cart");
  };

  const handleCheckout = () => {
    handleCloseSidebar();
    navigate("/checkout");
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 z-40 ${
          isSidebarVisible ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={handleCloseSidebar}
      ></div>

      {/* Sidebar Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ${
          isSidebarVisible ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="bg-red-600 text-white px-6 py-4 flex justify-between items-center">
            <h3 className="text-lg font-semibold">Shopping Cart ({itemCount})</h3>
            <button onClick={handleCloseSidebar} className="text-white">
              <X />
            </button>
          </div>

          {/* Content */}
          <div className="flex-grow overflow-auto p-6">
            {!cartItems || cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full">
                <FiShoppingCart
                  className="text-red-600 w-24 h-24 mb-4"
                  style={{ transform: 'rotate(-20deg)' }}
                />
                <p className="text-lg text-gray-700 text-center">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex gap-3 pb-4 border-b">
                    {/* Product Image */}
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded border border-gray-200"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                        No Image
                      </div>
                    )}

                    {/* Product Info */}
                    <div className="flex-1">
                      <p className="font-medium text-sm truncate max-w-[200px]">{item.name}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        {item.quantity} × LKR {item.price?.toLocaleString()}
                      </p>
                      <p className="text-sm font-semibold text-blue-600 mt-1">
                        LKR {(item.price * item.quantity)?.toLocaleString()}
                      </p>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-gray-400 hover:text-red-600 self-start"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Subtotal */}
          {cartItems && cartItems.length > 0 && (
            <div className="border-t px-6 py-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-base font-medium">Subtotal</span>
                <span className="text-base font-semibold text-red-600">
                  LKR {totalPrice?.toLocaleString()}
                </span>
              </div>

              {/* Footer Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleViewCart}
                  className="flex-1 py-2 bg-white border-2 border-red-600 text-red-600 text-center font-bold rounded hover:bg-red-50 transition"
                >
                  VIEW CART
                </button>
                <button
                  onClick={handleCheckout}
                  className="flex-1 py-2 bg-red-600 text-white text-center font-bold rounded hover:bg-red-700 transition"
                >
                  CHECKOUT
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ShoppingCartDrawer;
