const SparePartItem = require("../models/SparePartItem");
const fs = require("fs");
const path = require("path");

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Get all spare part items
exports.getAllItems = async (req, res) => {
  try {
    const items = await SparePartItem.find({ isActive: true }).populate(
      "categoryId"
    );
    res.json(items);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// Get all spare part items (admin - includes inactive)
exports.getAllItemsAdmin = async (req, res) => {
  try {
    const items = await SparePartItem.find().populate("categoryId");
    res.json(items);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// Get spare part items by category
exports.getItemsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const items = await SparePartItem.find({
      categoryId,
      isActive: true,
    }).populate("categoryId");
    res.json(items);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// Get spare part items by subcategory
exports.getItemsBySubcategory = async (req, res) => {
  try {
    const { categoryId, subcategoryId } = req.params;
    const items = await SparePartItem.find({
      categoryId,
      subcategoryId,
      isActive: true,
    }).populate("categoryId");
    res.json(items);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// Get single spare part item
exports.getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await SparePartItem.findById(id).populate("categoryId");
    if (!item) {
      return res.status(404).json({ message: "Spare part item not found" });
    }
    res.json(item);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// Create spare part item
exports.createItem = async (req, res) => {
  try {
    const {
      name,
      description,
      categoryId,
      subcategoryId,
      price,
      quantity,
      specifications,
      image,
      imageFileName,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Item name is required" });
    }

    if (!categoryId) {
      return res.status(400).json({ message: "Category ID is required" });
    }

    const item = new SparePartItem({
      name: name.trim(),
      description: description || "",
      categoryId,
      subcategoryId: subcategoryId || null,
      price: price || 0,
      quantity: quantity || 0,
      specifications: specifications || {},
      image: image || "",
      imageFileName: imageFileName || "",
    });

    const saved = await item.save();
    const populated = await saved.populate("categoryId");

    res.status(201).json({
      message: "Spare part item created successfully",
      item: populated,
    });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

// Update spare part item
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      categoryId,
      subcategoryId,
      price,
      quantity,
      specifications,
      image,
      imageFileName,
      isActive,
    } = req.body;

    const item = await SparePartItem.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Spare part item not found" });
    }

    if (name) item.name = name.trim();
    if (description !== undefined) item.description = description;
    if (categoryId) item.categoryId = categoryId;
    if (subcategoryId !== undefined) item.subcategoryId = subcategoryId || null;
    if (price !== undefined) item.price = price;
    if (quantity !== undefined) item.quantity = quantity;
    if (specifications) item.specifications = specifications;
    if (image) item.image = image;
    if (imageFileName) item.imageFileName = imageFileName;
    if (isActive !== undefined) item.isActive = isActive;

    const updated = await item.save();
    const populated = await updated.populate("categoryId");

    res.json({
      message: "Spare part item updated successfully",
      item: populated,
    });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

// Delete spare part item (soft delete)
exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await SparePartItem.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );
    if (!item) {
      return res.status(404).json({ message: "Spare part item not found" });
    }
    res.json({
      message: "Spare part item deleted successfully",
      item,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// Hard delete spare part item
exports.hardDeleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await SparePartItem.findByIdAndDelete(id);
    if (!item) {
      return res.status(404).json({ message: "Spare part item not found" });
    }
    res.json({
      message: "Spare part item permanently deleted",
      item,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// Upload image (converts to base64)
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image provided" });
    }

    // Read file and convert to base64
    const fileData = fs.readFileSync(req.file.path);
    const base64Data = fileData.toString("base64");
    const dataUri = `data:${req.file.mimetype};base64,${base64Data}`;

    // Delete temp file
    fs.unlinkSync(req.file.path);

    res.json({
      message: "Image uploaded successfully",
      image: dataUri,
      fileName: req.file.originalname,
      mimeType: req.file.mimetype,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// Toggle item active status
exports.toggleItemActive = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const item = await SparePartItem.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    ).populate("categoryId");

    if (!item) {
      return res.status(404).json({ message: "Spare part item not found" });
    }

    res.json({
      message: isActive
        ? "Item activated successfully"
        : "Item deactivated successfully",
      item,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
