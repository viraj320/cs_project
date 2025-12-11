import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaSearch,
  FaChevronDown,
  FaChevronRight,
  FaImage,
  FaTimes,
} from "react-icons/fa";

const AdminSparePartItems = () => {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categoryId: "",
    subcategoryId: "",
    price: "",
    quantity: "",
    image: "",
    imageFileName: "",
    specifications: {
      brand: "",
      model: "",
      compatibility: "",
      warranty: "",
    },
    productGrade: "Standard/OE",
    fitment: "Universal Fitment",
    availability: "In Stock",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCategories();
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/categories/admin/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(data);
    } catch (e) {
      console.error("Error fetching categories:", e);
    }
  };

  const fetchItems = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("http://localhost:5000/api/spare-parts/admin/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(data);
      setError("");
    } catch (e) {
      setError("Failed to load spare part items");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("specifications.")) {
      const specKey = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        specifications: { ...prev.specifications, [specKey]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
      setFormData((prev) => ({
        ...prev,
        image: reader.result,
        imageFileName: file.name,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Item name is required");
      return;
    }
    if (!formData.categoryId) {
      setError("Category is required");
      return;
    }

    try {
      if (editingId) {
        const { data } = await axios.put(
          `http://localhost:5000/api/spare-parts/${editingId}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setItems((prev) =>
          prev.map((item) => (item._id === editingId ? data.item : item))
        );
        setSuccess("Item updated successfully!");
      } else {
        const { data } = await axios.post(
          "http://localhost:5000/api/spare-parts",
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setItems((prev) => [data.item, ...prev]);
        setSuccess("Item created successfully!");
      }

      setFormData({
        name: "",
        description: "",
        categoryId: "",
        subcategoryId: "",
        price: "",
        quantity: "",
        image: "",
        imageFileName: "",
        specifications: {
          brand: "",
          model: "",
          compatibility: "",
          warranty: "",
        },
      });
      setPreviewImage(null);
      setEditingId(null);
      setShowForm(false);
      setError("");

      setTimeout(() => setSuccess(""), 3000);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to save item");
    }
  };

  const handleEdit = (item) => {
    setFormData({
      name: item.name,
      description: item.description || "",
      categoryId: item.categoryId._id || "",
      subcategoryId: item.subcategoryId || "",
      price: item.price || "",
      quantity: item.quantity || "",
      image: item.image || "",
      imageFileName: item.imageFileName || "",
      specifications: item.specifications || {},
    });
    setPreviewImage(item.image || null);
    setEditingId(item._id);
    setShowForm(true);
    setError("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/spare-parts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems((prev) => prev.filter((item) => item._id !== id));
      setSuccess("Item deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to delete item");
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      const { data } = await axios.patch(
        `http://localhost:5000/api/spare-parts/${id}/toggle`,
        { isActive: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setItems((prev) =>
        prev.map((item) => (item._id === id ? data.item : item))
      );
      setSuccess(
        currentStatus ? "Item deactivated!" : "Item activated!"
      );
      setTimeout(() => setSuccess(""), 3000);
    } catch (e) {
      setError("Failed to update item status");
    }
  };

  const toggleCategoryExpand = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const getCategoryName = (categoryId) => {
    return categories.find((c) => c._id === categoryId)?.name || "Unknown";
  };

  const getSubcategoryName = (categoryId, subcategoryId) => {
    const category = categories.find((c) => c._id === categoryId);
    if (!category) return "";
    const subcategory = category.subcategories?.find(
      (s) => s._id === subcategoryId
    );
    return subcategory?.name || "";
  };

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      getCategoryName(item.categoryId._id || item.categoryId)
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  const itemsByCategory = {};
  filteredItems.forEach((item) => {
    const catId = item.categoryId._id || item.categoryId;
    if (!itemsByCategory[catId]) {
      itemsByCategory[catId] = [];
    }
    itemsByCategory[catId].push(item);
  });

  if (loading && items.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="animate-spin text-2xl text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Spare Part Items</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({
              name: "",
              description: "",
              categoryId: "",
              subcategoryId: "",
              price: "",
              quantity: "",
              image: "",
              imageFileName: "",
              specifications: {
                brand: "",
                model: "",
                compatibility: "",
                warranty: "",
              },
              productGrade: "Standard/OE",
              fitment: "Universal Fitment",
              availability: "In Stock",
            });
            setPreviewImage(null);
            setError("");
          }}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
        >
          <FaPlus /> Add Item
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {success}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="mb-6 p-6 bg-white rounded-lg shadow-md border border-indigo-200">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? "Edit Item" : "Add New Item"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Item Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="e.g., Brake Pad Set"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Category *
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Subcategory
                </label>
                <select
                  name="subcategoryId"
                  value={formData.subcategoryId}
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={!formData.categoryId}
                >
                  <option value="">Select subcategory (optional)</option>
                  {formData.categoryId &&
                    categories
                      .find((c) => c._id === formData.categoryId)
                      ?.subcategories?.map((sub) => (
                        <option key={sub._id} value={sub._id}>
                          {sub.name}
                        </option>
                      ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleFormChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleFormChange}
                  placeholder="0"
                  min="0"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Brand</label>
                <input
                  type="text"
                  name="specifications.brand"
                  value={formData.specifications.brand || ""}
                  onChange={handleFormChange}
                  placeholder="e.g., Bosch"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Model</label>
                <input
                  type="text"
                  name="specifications.model"
                  value={formData.specifications.model || ""}
                  onChange={handleFormChange}
                  placeholder="e.g., BP-2024"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Compatibility
                </label>
                <input
                  type="text"
                  name="specifications.compatibility"
                  value={formData.specifications.compatibility || ""}
                  onChange={handleFormChange}
                  placeholder="e.g., Toyota 2020-2024"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Warranty</label>
                <input
                  type="text"
                  name="specifications.warranty"
                  value={formData.specifications.warranty || ""}
                  onChange={handleFormChange}
                  placeholder="e.g., 2 years"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Product Grade</label>
                <select
                  name="productGrade"
                  value={formData.productGrade || "Standard/OE"}
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Standard/OE">Standard/OE</option>
                  <option value="Premium">Premium</option>
                  <option value="Economy">Economy</option>
                  <option value="High Performance">High Performance</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Fitment</label>
                <select
                  name="fitment"
                  value={formData.fitment || "Universal Fitment"}
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Vehicle Specific">Vehicle Specific</option>
                  <option value="Universal Fitment">Universal Fitment</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Availability</label>
                <select
                  name="availability"
                  value={formData.availability || "In Stock"}
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="In Stock">In Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                placeholder="Describe this item..."
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows="3"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">
                <FaImage className="inline mr-2" /> Item Image
              </label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {formData.imageFileName && (
                    <p className="text-xs text-gray-600 mt-1">
                      {formData.imageFileName}
                    </p>
                  )}
                </div>
                {previewImage && (
                  <div className="relative">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="h-24 w-24 object-cover rounded border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewImage(null);
                        setFormData((prev) => ({
                          ...prev,
                          image: "",
                          imageFileName: "",
                        }));
                      }}
                      className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
              >
                {editingId ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({
                    name: "",
                    description: "",
                    categoryId: "",
                    subcategoryId: "",
                    price: "",
                    quantity: "",
                    image: "",
                    imageFileName: "",
                    specifications: {},
                  });
                  setPreviewImage(null);
                  setError("");
                }}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search */}
      <div className="mb-6 flex items-center gap-2">
        <FaSearch className="text-gray-400" />
        <input
          type="text"
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <span className="text-sm text-gray-600">
          {filteredItems.length} of {items.length}
        </span>
      </div>

      {/* Items List by Category */}
      <div className="space-y-4">
        {Object.keys(itemsByCategory).length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No items found
          </div>
        ) : (
          Object.keys(itemsByCategory).map((categoryId) => (
            <div key={categoryId}>
              {/* Category Header */}
              <div
                className="p-4 bg-blue-50 border border-blue-200 rounded-t-lg cursor-pointer hover:bg-blue-100 transition"
                onClick={() => toggleCategoryExpand(categoryId)}
              >
                <div className="flex items-center gap-3">
                  <button className="text-blue-600">
                    {expandedCategories[categoryId] ? (
                      <FaChevronDown />
                    ) : (
                      <FaChevronRight />
                    )}
                  </button>
                  <div className="flex-1">
                    <div className="font-semibold text-blue-700">
                      {getCategoryName(categoryId)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {itemsByCategory[categoryId].length} items
                    </div>
                  </div>
                </div>
              </div>

              {/* Items List */}
              {expandedCategories[categoryId] && (
                <div className="border-l border-r border-b border-blue-200 space-y-2 p-4 bg-white rounded-b-lg">
                  {itemsByCategory[categoryId].map((item) => (
                    <div
                      key={item._id}
                      className={`p-4 border rounded-lg ${
                        item.isActive
                          ? "bg-white border-gray-200"
                          : "bg-gray-50 border-gray-300 opacity-60"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        {/* Item Image */}
                        <div className="mr-4">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-20 w-20 object-cover rounded border"
                            />
                          ) : (
                            <div className="h-20 w-20 bg-gray-200 rounded border flex items-center justify-center">
                              <FaImage className="text-gray-400" size={20} />
                            </div>
                          )}
                        </div>

                        {/* Item Details */}
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">
                            {item.name}
                          </h4>
                          {item.subcategoryId && (
                            <p className="text-xs text-gray-500">
                              Subcategory: {getSubcategoryName(categoryId, item.subcategoryId)}
                            </p>
                          )}
                          {item.specifications?.brand && (
                            <p className="text-xs text-gray-600">
                              Brand: {item.specifications.brand}
                            </p>
                          )}
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                            {item.price && (
                              <span>
                                Price: <span className="font-medium">Rs {item.price}</span>
                              </span>
                            )}
                            {item.quantity !== undefined && (
                              <span>
                                Qty: <span className="font-medium">{item.quantity}</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                          <button
                            onClick={() =>
                              handleToggleActive(item._id, item.isActive)
                            }
                            className="flex items-center gap-1 text-sm p-2"
                          >
                            {item.isActive ? (
                              <FaCheckCircle className="text-green-600" />
                            ) : (
                              <FaTimesCircle className="text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminSparePartItems;
