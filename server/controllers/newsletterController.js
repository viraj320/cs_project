const Subscriber = require("../models/Subscriber");

const subscribe = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const existing = await Subscriber.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(200).json({ message: "You are already subscribed" });
    }

    const created = await Subscriber.create({ email });
    res.status(201).json({ message: "Subscribed successfully", data: created });
  } catch (err) {
    console.error("Error subscribing newsletter:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const listSubscribers = async (req, res) => {
  try {
    const items = await Subscriber.find().sort({ createdAt: -1 });
    res.status(200).json({ data: items });
  } catch (err) {
    console.error("Error listing subscribers:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { subscribe, listSubscribers };
