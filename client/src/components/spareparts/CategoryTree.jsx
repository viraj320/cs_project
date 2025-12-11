import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSpinner, FaChevronDown, FaChevronRight } from "react-icons/fa";

const CategoryTree = ({ onSelectCategory }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("http://localhost:5000/api/categories");
      setCategories(data);
      setError(null);
    } catch (err) {
      setError("Failed to load categories");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategoryExpand = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  if (loading) {
    return (
      <div className="w-full p-8 bg-white rounded-md shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Categories</h2>
        <div className="flex justify-center items-center py-8">
          <FaSpinner className="animate-spin text-2xl text-indigo-600" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-8 bg-white rounded-md shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Categories</h2>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full p-8 bg-white rounded-md shadow-md overflow-y-auto max-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Categories</h2>

      {categories.length === 0 ? (
        <p className="text-gray-500">No categories available</p>
      ) : (
        <div className="flex flex-col gap-3">
          {categories.map((category) => (
            <div key={category._id}>
              {/* Category Header */}
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded hover:bg-blue-100 transition">
                {/* Expand/Collapse Button */}
                {category.subcategories && category.subcategories.length > 0 ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCategoryExpand(category._id);
                    }}
                    className="text-blue-600 hover:text-blue-700 flex-shrink-0 flex items-center"
                  >
                    {expandedCategories[category._id] ? (
                      <FaChevronDown size={16} />
                    ) : (
                      <FaChevronRight size={16} />
                    )}
                  </button>
                ) : (
                  <div className="w-4 flex-shrink-0" />
                )}

                {/* Category Content */}
                <span className="text-2xl">{category.icon}</span>
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => onSelectCategory && onSelectCategory(category._id)}
                >
                  <div className="font-semibold text-blue-700">{category.name}</div>
                  {category.subcategories && category.subcategories.length > 0 && (
                    <span className="text-xs text-gray-500">
                      {category.subcategories.length} subcategories
                    </span>
                  )}
                </div>
              </div>

              {/* Subcategories List */}
              {expandedCategories[category._id] &&
                category.subcategories &&
                category.subcategories.length > 0 && (
                  <div className="ml-6 mt-2 space-y-2 border-l-2 border-blue-300 pl-3">
                    {category.subcategories.map((subcategory) => (
                      <div
                        key={subcategory._id}
                        onClick={() =>
                          onSelectCategory && onSelectCategory(category._id)
                        }
                        className="flex items-center gap-2 p-3 bg-blue-100 rounded hover:bg-blue-200 cursor-pointer transition"
                      >
                        <span className="text-xl">{subcategory.icon}</span>
                        <div className="flex-1">
                          <div className="font-medium text-blue-800">
                            {subcategory.name}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryTree;
