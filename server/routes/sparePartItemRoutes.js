const express = require("express");
const router = express.Router();
const sparePartItemController = require("../controllers/sparePartItemController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const multer = require("multer");

// Multer configuration for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Public routes
router.get("/", sparePartItemController.getAllItems);
router.get("/item/:id", sparePartItemController.getItemById);
router.get("/category/:categoryId", sparePartItemController.getItemsByCategory);
router.get(
  "/category/:categoryId/subcategory/:subcategoryId",
  sparePartItemController.getItemsBySubcategory
);

// Protected routes - admin only
router.use(authMiddleware);
router.use(roleMiddleware(["admin"]));

router.get("/admin/all", sparePartItemController.getAllItemsAdmin);
router.post("/", sparePartItemController.createItem);
router.put("/:id", sparePartItemController.updateItem);
router.delete("/:id", sparePartItemController.deleteItem);
router.delete("/:id/permanent", sparePartItemController.hardDeleteItem);
router.patch("/:id/toggle", sparePartItemController.toggleItemActive);

// Image upload endpoint
router.post("/upload/image", upload.single("image"), sparePartItemController.uploadImage);

module.exports = router;
