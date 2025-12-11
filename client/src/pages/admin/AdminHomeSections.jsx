import React, { useEffect, useState } from "react";
import API from "../../services/api";

const emptyForm = {
  section: "flash",
  title: "",
  subtitle: "",
  description: "",
  price: "",
  quantity: "",
  image: "",
  imageFile: null,
  buttonText: "Shop Now",
  bgColor: "bg-gray-800",
  productName: "",
  productDescription: "",
  productGrade: "",
  fitment: "",
  brand: "",
  model: "",
  compatibility: "",
  warranty: "",
};

const AdminHomeSections = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await API.get("/home-sections");
      setItems(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (err) {
      console.error("Failed to load home sections", err);
      alert("Failed to load items");
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title) {
      alert("Title is required");
      return;
    }
    try {
      setSaving(true);
      const fd = new FormData();
      const append = (k, v) => {
        if (v === undefined || v === null || v === "") return;
        fd.append(k, v);
      };

      append("section", form.section);
      append("title", form.title);
      append("subtitle", form.subtitle);
      append("description", form.description);
      append("price", form.price);
      append("quantity", form.quantity);
      append("image", form.image);
      append("buttonText", form.buttonText);
      append("bgColor", form.bgColor);
      append("productName", form.productName);
      append("productDescription", form.productDescription);
      append("productGrade", form.productGrade);
      append("fitment", form.fitment);
      append("brand", form.brand);
      append("model", form.model);
      append("compatibility", form.compatibility);
      append("warranty", form.warranty);
      if (form.imageFile) {
        fd.append("imageFile", form.imageFile);
      }

      if (editingId) {
        await API.put(`/home-sections/${editingId}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Item updated");
      } else {
        await API.post("/home-sections", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Item added");
      }

      setForm(emptyForm);
      setEditingId(null);
      await load();
    } catch (err) {
      console.error("Failed to save item", err);
      alert("Failed to save item");
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      await API.delete(`/home-sections/${id}`);
      setItems((prev) => prev.filter((i) => i._id !== id));
    } catch (err) {
      console.error("Failed to delete", err);
      alert("Delete failed");
    }
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setForm({
      section: item.section || "flash",
      title: item.title || "",
      subtitle: item.subtitle || "",
      description: item.description || "",
      price: item.price ?? "",
      quantity: item.quantity ?? "",
      image: item.image || "",
      imageFile: null,
      buttonText: item.buttonText || "Shop Now",
      bgColor: item.bgColor || "bg-gray-800",
      productName: item.product?.name || "",
      productDescription: item.product?.description || "",
      productGrade: item.product?.productGrade || "",
      fitment: item.product?.fitment || "",
      brand: item.product?.specifications?.brand || "",
      model: item.product?.specifications?.model || "",
      compatibility: item.product?.specifications?.compatibility || "",
      warranty: item.product?.specifications?.warranty || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const filtered = (section) => items.filter((i) => i.section === section);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Homepage Collections</h1>
        <button
          onClick={load}
          className="px-3 py-2 bg-indigo-600 text-white rounded shadow-sm text-sm"
        >
          Refresh
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Section</label>
          <select
            value={form.section}
            onChange={(e) => setForm({ ...form, section: e.target.value })}
            className="w-full border rounded px-3 py-2 text-sm"
          >
            <option value="flash">Flash Deals</option>
            <option value="new">New Our Parts</option>
            <option value="best">Best Seller Our Parts</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            className="w-full border rounded px-3 py-2 text-sm"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Subtitle</label>
          <input
            className="w-full border rounded px-3 py-2 text-sm"
            value={form.subtitle}
            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            className="w-full border rounded px-3 py-2 text-sm"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Price (Rs)</label>
          <input
            type="number"
            className="w-full border rounded px-3 py-2 text-sm"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            min="0"
            step="0.01"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Quantity</label>
          <input
            type="number"
            className="w-full border rounded px-3 py-2 text-sm"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Image URL</label>
          <input
            className="w-full border rounded px-3 py-2 text-sm"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Or Upload Image</label>
          <input
            type="file"
            accept="image/*"
            className="w-full text-sm"
            onChange={(e) => setForm({ ...form, imageFile: e.target.files?.[0] || null })}
          />
          {editingId && form.image && (
            <p className="text-xs text-gray-500 mt-1">Current image: {form.image}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Button Text</label>
          <input
            className="w-full border rounded px-3 py-2 text-sm"
            value={form.buttonText}
            onChange={(e) => setForm({ ...form, buttonText: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Background Class</label>
          <input
            className="w-full border rounded px-3 py-2 text-sm"
            value={form.bgColor}
            onChange={(e) => setForm({ ...form, bgColor: e.target.value })}
          />
        </div>

        {/* Optional product meta (used by best/new sections) */}
        <div className="md:col-span-2 border-t pt-3">
          <h3 className="font-semibold mb-2 text-sm text-gray-700">Product Meta (optional)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              placeholder="Product Name"
              className="border rounded px-3 py-2 text-sm"
              value={form.productName}
              onChange={(e) => setForm({ ...form, productName: e.target.value })}
            />
            <input
              placeholder="Product Grade"
              className="border rounded px-3 py-2 text-sm"
              value={form.productGrade}
              onChange={(e) => setForm({ ...form, productGrade: e.target.value })}
            />
            <input
              placeholder="Fitment"
              className="border rounded px-3 py-2 text-sm"
              value={form.fitment}
              onChange={(e) => setForm({ ...form, fitment: e.target.value })}
            />
            <input
              placeholder="Brand"
              className="border rounded px-3 py-2 text-sm"
              value={form.brand}
              onChange={(e) => setForm({ ...form, brand: e.target.value })}
            />
            <input
              placeholder="Model"
              className="border rounded px-3 py-2 text-sm"
              value={form.model}
              onChange={(e) => setForm({ ...form, model: e.target.value })}
            />
            <input
              placeholder="Compatibility"
              className="border rounded px-3 py-2 text-sm"
              value={form.compatibility}
              onChange={(e) => setForm({ ...form, compatibility: e.target.value })}
            />
            <input
              placeholder="Warranty"
              className="border rounded px-3 py-2 text-sm"
              value={form.warranty}
              onChange={(e) => setForm({ ...form, warranty: e.target.value })}
            />
            <textarea
              placeholder="Product Description"
              className="border rounded px-3 py-2 text-sm md:col-span-3"
              value={form.productDescription}
              onChange={(e) => setForm({ ...form, productDescription: e.target.value })}
              rows={2}
            />
          </div>
        </div>

        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded text-sm disabled:opacity-60"
          >
            {saving ? "Saving..." : editingId ? "Update Item" : "Add Item"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="ml-2 px-4 py-2 border rounded text-sm"
              disabled={saving}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {["flash", "new", "best"].map((section) => (
          <div key={section} className="bg-white rounded shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-lg capitalize">{section} items</h2>
              <span className="text-xs text-gray-500">{filtered(section).length}</span>
            </div>
            {loading ? (
              <div className="text-sm text-gray-500">Loading...</div>
            ) : filtered(section).length === 0 ? (
              <div className="text-sm text-gray-500">No items yet.</div>
            ) : (
              <ul className="space-y-3">
                {filtered(section).map((item) => (
                  <li key={item._id} className="border rounded p-3 flex justify-between items-start gap-3">
                    <div className="space-y-1">
                      <div className="font-semibold">{item.title}</div>
                      {item.subtitle && <div className="text-xs text-gray-500">{item.subtitle}</div>}
                      {item.price !== undefined && <div className="text-sm text-gray-700">Rs {Number(item.price || 0).toLocaleString()}</div>}
                    </div>
                    <button
                      onClick={() => startEdit(item)}
                      className="text-blue-600 text-sm hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-600 text-sm hover:underline"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </section>
    </div>
  );
};

export default AdminHomeSections;
