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
} from "react-icons/fa";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showSubcategoryForm, setShowSubcategoryForm] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "📦",
  });
  const [subcategoryForm, setSubcategoryForm] = useState({
    name: "",
    description: "",
    icon: "📌",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("token");

  // Fetch categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("http://localhost:5000/api/categories/admin/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(data);
      setError("");
    } catch (e) {
      setError("Failed to load categories");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubcategoryChange = (e) => {
    const { name, value } = e.target;
    setSubcategoryForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleIconChange = (icon) => {
    setFormData((prev) => ({ ...prev, icon }));
  };

  const handleSubcategoryIconChange = (icon) => {
    setSubcategoryForm((prev) => ({ ...prev, icon }));
  };

  const commonIcons = ["📦", "⚙️", "🛑", "🔧", "⚡", "🔋", "🎨", "🪑", "💧", "🛞", "✨"];
  const subcategoryIcons = ["📌", "🔹", "▪️", "🏷️", "📍", "🎯", "💫", "⭐", "🌟", "✔️", "➡️"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Category name is required");
      return;
    }

    try {
      if (editingId) {
        // Update
        const { data } = await axios.put(
          `http://localhost:5000/api/categories/${editingId}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCategories((prev) =>
          prev.map((cat) => (cat._id === editingId ? data : cat))
        );
        setSuccess("Category updated successfully!");
      } else {
        // Create
        const { data } = await axios.post(
          "http://localhost:5000/api/categories",
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCategories((prev) => [data, ...prev]);
        setSuccess("Category created successfully!");
      }

      // Reset form
      setFormData({ name: "", description: "", icon: "📦" });
      setEditingId(null);
      setShowForm(false);
      setError("");

      setTimeout(() => setSuccess(""), 3000);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to save category");
    }
  };

  const handleAddSubcategory = async (categoryId) => {
    if (!subcategoryForm.name.trim()) {
      setError("Subcategory name is required");
      return;
    }

    try {
      const { data } = await axios.post(
        `http://localhost:5000/api/categories/${categoryId}/subcategories`,
        subcategoryForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCategories((prev) =>
        prev.map((cat) => (cat._id === categoryId ? data.category : cat))
      );
      setSuccess("Subcategory added successfully!");
      setSubcategoryForm({ name: "", description: "", icon: "📌" });
      setShowSubcategoryForm(null);
      setTimeout(() => setSuccess(""), 3000);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to add subcategory");
    }
  };

  const handleDeleteSubcategory = async (categoryId, subcategoryId) => {
    if (!window.confirm("Delete this subcategory?")) return;

    try {
      const { data } = await axios.delete(
        `http://localhost:5000/api/categories/${categoryId}/subcategories/${subcategoryId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCategories((prev) =>
        prev.map((cat) => (cat._id === categoryId ? data.category : cat))
      );
      setSuccess("Subcategory deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to delete subcategory");
    }
  };

  const handleEdit = (category) => {
    setFormData({
      name: category.name,
      description: category.description,
      icon: category.icon,
    });
    setEditingId(category._id);
    setShowForm(true);
    setError("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories((prev) => prev.filter((cat) => cat._id !== id));
      setSuccess("Category deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to delete category");
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      const { data } = await axios.put(
        `http://localhost:5000/api/categories/${id}`,
        { isActive: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCategories((prev) =>
        prev.map((cat) => (cat._id === id ? data : cat))
      );
      setSuccess(
        currentStatus ? "Category deactivated!" : "Category activated!"
      );
      setTimeout(() => setSuccess(""), 3000);
    } catch (e) {
      setError("Failed to update category status");
    }
  };

  const toggleCategoryExpand = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(search.toLowerCase()) ||
      cat.description.toLowerCase().includes(search.toLowerCase())
  );

  if (loading && categories.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="animate-spin text-2xl text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Spare Part Categories</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({ name: "", description: "", icon: "📦" });
            setError("");
          }}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
        >
          <FaPlus /> Add Category
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
            {editingId ? "Edit Category" : "Create New Category"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Category Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                placeholder="e.g., Engine Parts"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                placeholder="Describe this category..."
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows="3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Choose Icon
              </label>
              <div className="flex gap-2 flex-wrap">
                {commonIcons.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => handleIconChange(icon)}
                    className={`text-3xl p-2 border rounded transition ${
                      formData.icon === icon
                        ? "border-indigo-600 bg-indigo-50"
                        : "border-gray-300 hover:border-indigo-300"
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
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
                  setFormData({ name: "", description: "", icon: "📦" });
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
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <span className="text-sm text-gray-600">
          {filteredCategories.length} of {categories.length}
        </span>
      </div>

      {/* Categories List */}
      <div className="space-y-4">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No categories found
          </div>
        ) : (
          filteredCategories.map((category) => (
            <div
              key={category._id}
              className={`border rounded-lg shadow-sm transition ${
                category.isActive
                  ? "bg-white border-gray-200"
                  : "bg-gray-50 border-gray-300 opacity-60"
              }`}
            >
              {/* Category Header */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <button
                    onClick={() => toggleCategoryExpand(category._id)}
                    className="text-indigo-600 hover:text-indigo-700"
                  >
                    {expandedCategories[category._id] ? (
                      <FaChevronDown />
                    ) : (
                      <FaChevronRight />
                    )}
                  </button>
                  <span className="text-3xl">{category.icon}</span>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{category.name}</h3>
                    <p className="text-sm text-gray-600">
                      {category.description || "No description"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">
                    {category.subcategories?.length || 0} subcategories
                  </span>
                  <button
                    onClick={() => handleEdit(category)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                    title="Edit"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(category._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                  <button
                    onClick={() =>
                      handleToggleActive(category._id, category.isActive)
                    }
                    className="flex items-center gap-1 text-sm"
                  >
                    {category.isActive ? (
                      <FaCheckCircle className="text-green-600" />
                    ) : (
                      <FaTimesCircle className="text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Subcategories */}
              {expandedCategories[category._id] && (
                <div className="border-t bg-gray-50 p-4 space-y-3">
                  {/* Add Subcategory Form */}
                  {showSubcategoryForm === category._id ? (
                    <div className="p-4 bg-white border border-indigo-200 rounded">
                      <h4 className="font-semibold mb-3">Add Subcategory</h4>
                      <div className="space-y-3">
                        <input
                          type="text"
                          name="name"
                          placeholder="Subcategory name"
                          value={subcategoryForm.name}
                          onChange={handleSubcategoryChange}
                          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <textarea
                          name="description"
                          placeholder="Description (optional)"
                          value={subcategoryForm.description}
                          onChange={handleSubcategoryChange}
                          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          rows="2"
                        />
                        <div>
                          <label className="text-sm font-medium mb-1 block">Icon</label>
                          <div className="flex gap-2 flex-wrap">
                            {subcategoryIcons.map((icon) => (
                              <button
                                key={icon}
                                type="button"
                                onClick={() => handleSubcategoryIconChange(icon)}
                                className={`text-2xl p-2 border rounded transition ${
                                  subcategoryForm.icon === icon
                                    ? "border-indigo-600 bg-indigo-50"
                                    : "border-gray-300 hover:border-indigo-300"
                                }`}
                              >
                                {icon}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAddSubcategory(category._id)}
                            className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition text-sm"
                          >
                            Add
                          </button>
                          <button
                            onClick={() => {
                              setShowSubcategoryForm(null);
                              setSubcategoryForm({
                                name: "",
                                description: "",
                                icon: "📌",
                              });
                            }}
                            className="bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400 transition text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowSubcategoryForm(category._id)}
                      className="text-indigo-600 hover:text-indigo-700 text-sm flex items-center gap-2"
                    >
                      <FaPlus /> Add Subcategory
                    </button>
                  )}

                  {/* List Subcategories */}
                  {category.subcategories && category.subcategories.length > 0 && (
                    <div className="space-y-2 mt-4">
                      {category.subcategories.map((sub) => (
                        <div
                          key={sub._id}
                          className="flex items-center justify-between bg-white p-3 rounded border border-gray-200"
                        >
                          <div className="flex items-center gap-2 flex-1">
                            <span className="text-xl">{sub.icon}</span>
                            <div>
                              <div className="font-medium text-sm">{sub.name}</div>
                              {sub.description && (
                                <div className="text-xs text-gray-600">
                                  {sub.description}
                                </div>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              handleDeleteSubcategory(category._id, sub._id)
                            }
                            className="p-1 text-red-600 hover:bg-red-50 rounded transition"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminCategories;
