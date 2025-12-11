import React from "react";

const CartItem = ({ product, quantity, handleQuantityChange }) => {
  return (
    <div className="flex items-center justify-between mb-4 border-b py-4">
      <img
        src={product.image}
        alt={product.name}
        className="w-24 h-24 object-cover rounded"
      />
      <div className="flex-grow ml-4">
        <h3 className="font-semibold text-lg">{product.name}</h3>
        <p className="text-gray-600">Unit Price: LKR {product.price.toLocaleString()}</p>
      </div>
      <div className="flex flex-col items-end">
        <input
          type="number"
          value={quantity}
          onChange={handleQuantityChange}
          min="1"
          className="border rounded p-2 w-16 text-center"
        />
        <p className="mt-2 font-semibold">LKR {product.price * quantity}</p>
      </div>
    </div>
  );
};

export default CartItem;
