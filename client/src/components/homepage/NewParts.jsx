import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';

const NewParts = () => {
  const navigate = useNavigate();
  const [loadingId, setLoadingId] = useState(null);
  const [items, setItems] = useState([]);
  const apiOrigin = API.defaults.baseURL?.replace(/\/api$/, '') || '';

  const resolveImage = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${apiOrigin}${path}`;
  };

  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get('/home-sections?section=new');
        const data = Array.isArray(res.data?.data) ? res.data.data : [];
        setItems(data);
      } catch (err) {
        console.error('Failed to load new parts', err);
        setItems([]);
      }
    };
    load();
  }, []);
  const handleBook = (item) => {
    setLoadingId(item._id || item.title);
    const baseProduct = item.product
      ? {
          ...item.product,
          image: item.product.image || item.image,
        }
      : {
          _id: item._id,
          name: item.title,
          description: item.description,
          price: item.price,
          quantity: item.quantity,
          availability: item.quantity > 0 ? 'In Stock' : 'Out of Stock',
          image: item.image,
        };

    const product = {
      ...baseProduct,
      image: baseProduct.image ? resolveImage(baseProduct.image) : null,
    };

    navigate('/view-details', { state: { product } });
    setTimeout(() => setLoadingId(null), 400);
  };
  return (
    <div className="py-10 bg-[#f9f9f9]">
      <h2 className="text-3xl font-bold text-center text-orange-600 mb-12 uppercase">
        New Our Parts
      </h2>
      <div className="max-w-7xl mx-auto px-4 grid gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {items.map((product, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 p-8 flex flex-col items-center text-center transform hover:-translate-y-2"
          >
            <img
              src={resolveImage(product.image)}
              alt={product.title || product.name}
              className="w-32 h-32 object-contain mb-6"
            />
            <h3 className="text-2xl font-semibold mb-2">{product.title || product.name}</h3>
            <p className="text-gray-800 text-lg">
              Price: <strong>{product.price ? `Rs ${Number(product.price).toLocaleString()}` : 'N/A'}</strong>
            </p>
            <p className="text-gray-800 text-lg mb-3">
              Quantity: <strong>{product.quantity || 0}</strong>
            </p>
            <p className="text-gray-600 text-sm mb-6">{product.description}</p>
            <button
              onClick={() => handleBook(product)}
              disabled={loadingId === (product._id || product.title)}
              className="bg-orange-500 hover:bg-orange-600 transition text-white font-semibold py-2 px-6 rounded-full mt-auto disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loadingId === (product._id || product.title) ? 'Opening...' : 'BOOK NOW'}
            </button>
            <p className="text-xs text-gray-500 mt-2">Opens item to add to cart.</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewParts;
