const express = require("express");
const router = express.Router();
const {
  createContact,
  getAllContacts,
  markAsRead,
  deleteContact,
} = require("../controllers/contactController");

// Create contact message
router.post("/", createContact);

// Get all contact messages (for admin)
router.get("/all", getAllContacts);

// Mark as read
router.put("/:id/read", markAsRead);

// Delete contact message
router.delete("/:id", deleteContact);

module.exports = router;
