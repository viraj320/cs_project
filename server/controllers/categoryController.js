const Category = require("../models/Category");

// GET all categories (public)
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(categories);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// GET all categories including inactive (admin only)
exports.getAllCategoriesAdmin = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// GET single category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// CREATE new category (admin only)
exports.createCategory = async (req, res) => {
  try {
    const { name, description, icon } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const existingCategory = await Category.findOne({ name: new RegExp(`^${name}$`, "i") });
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = new Category({
      name: name.trim(),
      description: description || "",
      icon: icon || "📦",
    });

    const saved = await category.save();
    res.status(201).json(saved);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

// UPDATE category (admin only)
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, icon, isActive } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Check if name already exists (excluding self)
    if (name && name !== category.name) {
      const existing = await Category.findOne({ name: new RegExp(`^${name}$`, "i") });
      if (existing) {
        return res.status(400).json({ message: "Category name already exists" });
      }
      category.name = name.trim();
    }

    if (description !== undefined) category.description = description;
    if (icon !== undefined) category.icon = icon;
    if (isActive !== undefined) category.isActive = isActive;

    const updated = await category.save();
    res.json(updated);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

// DELETE category (soft delete - admin only)
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    category.isActive = false;
    const updated = await category.save();
    res.json({ message: "Category deleted successfully", category: updated });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

// Hard delete category (permanent - admin only)
exports.hardDeleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json({ message: "Category permanently deleted", category: deleted });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

// Seed default categories
exports.seedCategories = async (req, res) => {
  try {
    const defaultCategories = [
      { name: "Engine Parts", description: "Engine and engine-related components", icon: "⚙️" },
      { name: "Brakes", description: "Brake pads, discs, calipers, and related parts", icon: "🛑" },
      { name: "Suspension", description: "Shocks, springs, and suspension components", icon: "🔧" },
      { name: "Transmission", description: "Transmission fluid, filters, and parts", icon: "⚡" },
      { name: "Electrical", description: "Batteries, alternators, starters, and wiring", icon: "🔋" },
      { name: "Body & Paint", description: "Panels, bumpers, lights, and paint supplies", icon: "🎨" },
      { name: "Interior", description: "Seats, steering wheels, and interior components", icon: "🪑" },
      { name: "Filters & Fluids", description: "Oil filters, air filters, coolant, and fluids", icon: "💧" },
      { name: "Tires & Wheels", description: "Tires, rims, and wheel-related products", icon: "🛞" },
      { name: "Accessories", description: "Car accessories and add-ons", icon: "✨" },
    ];

    const created = await Category.insertMany(defaultCategories, { ordered: false });
    res.status(201).json({
      message: `${created.length} categories seeded successfully`,
      categories: created,
    });
  } catch (e) {
    if (e.code === 11000) {
      // Duplicate key error - some categories already exist
      res.status(400).json({ message: "Some categories already exist", error: e.message });
    } else {
      res.status(400).json({ message: e.message });
    }
  }
};

// ADD SUBCATEGORY to a category
exports.addSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, icon } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Subcategory name is required" });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const subcategory = {
      name: name.trim(),
      description: description || "",
      icon: icon || "📌",
    };

    category.subcategories.push(subcategory);
    const updated = await category.save();
    
    res.status(201).json({
      message: "Subcategory added successfully",
      category: updated,
      subcategory: updated.subcategories[updated.subcategories.length - 1],
    });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

// UPDATE SUBCATEGORY
exports.updateSubcategory = async (req, res) => {
  try {
    const { id, subcategoryId } = req.params;
    const { name, description, icon } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const subcategory = category.subcategories.id(subcategoryId);
    if (!subcategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    if (name) subcategory.name = name.trim();
    if (description !== undefined) subcategory.description = description;
    if (icon) subcategory.icon = icon;

    const updated = await category.save();
    res.json({
      message: "Subcategory updated successfully",
      category: updated,
    });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

// DELETE SUBCATEGORY
exports.deleteSubcategory = async (req, res) => {
  try {
    const { id, subcategoryId } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const subcategory = category.subcategories.id(subcategoryId);
    if (!subcategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    subcategory.deleteOne();
    const updated = await category.save();

    res.json({
      message: "Subcategory deleted successfully",
      category: updated,
    });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
