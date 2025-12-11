const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Public route - get all active categories
router.get("/", categoryController.getAllCategories);

// Get single category
router.get("/:id", categoryController.getCategoryById);

// Protected routes - admin only
router.use(authMiddleware);
router.use(roleMiddleware(["admin"]));

// Get all categories (including inactive)
router.get("/admin/all", categoryController.getAllCategoriesAdmin);

// Create category
router.post("/", categoryController.createCategory);

// Update category
router.put("/:id", categoryController.updateCategory);

// Delete category (soft delete)
router.delete("/:id", categoryController.deleteCategory);

// Hard delete category (permanent)
router.delete("/:id/permanent", categoryController.hardDeleteCategory);

// Seed default categories
router.post("/seed/default", categoryController.seedCategories);

// SUBCATEGORY ROUTES
// Add subcategory to a category
router.post("/:id/subcategories", categoryController.addSubcategory);

// Update subcategory
router.put("/:id/subcategories/:subcategoryId", categoryController.updateSubcategory);

// Delete subcategory
router.delete("/:id/subcategories/:subcategoryId", categoryController.deleteSubcategory);

module.exports = router;
