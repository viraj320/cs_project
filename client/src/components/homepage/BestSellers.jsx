import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';

const BestSellerParts = () => {
  const navigate = useNavigate();
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
        const res = await API.get('/home-sections?section=best');
        const data = Array.isArray(res.data?.data) ? res.data.data : [];
        setItems(data);
      } catch (err) {
        console.error('Failed to load best sellers', err);
        setItems([]);
      }
    };
    load();
  }, []);

  const handleShopNow = (item) => {
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
          productGrade: '',
          fitment: '',
          specifications: {},
        };

    const product = {
      ...baseProduct,
      image: baseProduct.image ? resolveImage(baseProduct.image) : null,
    };

    navigate('/view-details', { state: { product } });
  };

  return (
    <div className="py-16 bg-white">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-10 uppercase">
        Best Seller Our Parts
      </h2>

      <div className="max-w-7xl mx-auto grid gap-6 grid-cols-1 md:grid-cols-3 px-4">
        {items.map((item, index) => (
          <div
            key={index}
            className={`rounded-lg overflow-hidden shadow-md hover:shadow-lg transition relative ${item.bgColor || 'bg-gray-800'}`}
          >
            {resolveImage(item.image) ? (
              <img
                src={resolveImage(item.image)}
                alt={item.title}
                className="w-full h-56 object-cover"
              />
            ) : (
              <div className="w-full h-56 bg-gray-200 flex items-center justify-center text-gray-500">No image</div>
            )}
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-30"></div>

            <div className="absolute inset-0 p-6 flex flex-col justify-center">
              <p className="text-white text-sm mb-2">{item.subtitle}</p>
              <h3 className="text-white text-xl font-bold mb-4">{item.title}</h3>
              <button
                onClick={() => handleShopNow(item)}
                className="bg-white text-black text-sm font-semibold px-4 py-2 rounded hover:bg-gray-200 transition w-fit"
              >
                {item.buttonText}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BestSellerParts;
