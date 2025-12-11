const Router = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { createItem, listItems, updateItem, deleteItem } = require("../controllers/homeSectionController");

const router = Router();

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "../uploads/home-sections");
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
	destination: (req, file, cb) => cb(null, uploadDir),
	filename: (req, file, cb) => {
		const ext = path.extname(file.originalname) || "";
		cb(null, `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`);
	},
});

const upload = multer({ storage });

router.get("/", listItems);
router.post("/", upload.single("imageFile"), createItem);
router.put("/:id", upload.single("imageFile"), updateItem);
router.delete("/:id", deleteItem);

module.exports = router;
