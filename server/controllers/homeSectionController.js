const HomeSectionItem = require("../models/HomeSectionItem");

const buildProduct = (body) => {
  const {
    productName,
    productDescription,
    productGrade,
    fitment,
    brand,
    model,
    compatibility,
    warranty,
    image,
    price,
    quantity,
  } = body;
  return {
    _id: body.productId || undefined,
    name: productName || body.title,
    description: productDescription || body.description,
    price: price !== undefined ? Number(price) : 0,
    quantity: quantity !== undefined ? Number(quantity) : 0,
    availability: quantity > 0 ? "In Stock" : "Out of Stock",
    image: image || body.image || "",
    productGrade: productGrade || "",
    fitment: fitment || "",
    specifications: {
      brand: brand || "",
      model: model || "",
      compatibility: compatibility || "",
      warranty: warranty || "",
    },
  };
};

exports.createItem = async (req, res) => {
  try {
    const { section, title, subtitle, description, price, quantity, image, buttonText, bgColor } = req.body;
    if (!section || !title) {
      return res.status(400).json({ message: "section and title are required" });
    }

    const imagePath = req.file ? `/uploads/home-sections/${req.file.filename}` : image;

    const doc = await HomeSectionItem.create({
      section,
      title,
      subtitle,
      description,
      price: price !== undefined ? Number(price) : 0,
      quantity: quantity !== undefined ? Number(quantity) : 0,
      image: imagePath,
      buttonText,
      bgColor,
      product: buildProduct({ ...req.body, image: imagePath }),
    });

    res.status(201).json({ message: "Item created", data: doc });
  } catch (err) {
    console.error("Error creating home section item", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.listItems = async (req, res) => {
  try {
    const { section } = req.query;
    const q = section ? { section } : {};
    const items = await HomeSectionItem.find(q).sort({ createdAt: -1 });
    res.json({ data: items });
  } catch (err) {
    console.error("Error listing home section items", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    if (updates.price !== undefined) updates.price = Number(updates.price);
    if (updates.quantity !== undefined) updates.quantity = Number(updates.quantity);
    if (updates.section && !["flash", "new", "best"].includes(updates.section)) {
      return res.status(400).json({ message: "Invalid section" });
    }

    if (req.file) {
      updates.image = `/uploads/home-sections/${req.file.filename}`;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    if (updates.title || updates.description || updates.price !== undefined || updates.quantity !== undefined || updates.image) {
      updates.product = buildProduct({ ...updates });
    }

    const updated = await HomeSectionItem.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: "Item not found" });
    res.json({ message: "Item updated", data: updated });
  } catch (err) {
    console.error("Error updating home section item", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await HomeSectionItem.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Item not found" });
    res.json({ message: "Item deleted" });
  } catch (err) {
    console.error("Error deleting home section item", err);
    res.status(500).json({ message: "Server error" });
  }
};
