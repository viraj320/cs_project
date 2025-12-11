const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

require("dotenv").config();


const app = express();

// CORS Configuration
const corsOptions = {
  origin: "http://localhost:5173", // Frontend URL
  credentials: true, // Allow credentials (cookies, Authorization headers)
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Add headers to prevent COOP issues
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});

// Connect to MongoDB
connectDB();

// Test route
app.get("/", (req, res) => {
  res.send("API is running!");
});

// Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// Garage routes
const garageRoutes = require("./routes/garageRoutes");
app.use("/api/garage", garageRoutes);

// Garage Owner routes
const garageOwnerRoutes = require("./routes/garageOwnerRoutes");
app.use("/api/garage-owner", garageOwnerRoutes);

// Garage Admin routes
const garageAdminRoutes = require("./routes/garageAdminRoutes");
app.use("/api/garage-admin", garageAdminRoutes);

// Service routes
const serviceRoutes = require("./routes/serviceRoutes");
app.use("/api/services", serviceRoutes);

// Category routes
const categoryRoutes = require("./routes/categoryRoutes");
app.use("/api/categories", categoryRoutes);

// Spare Part Item routes
const sparePartItemRoutes = require("./routes/sparePartItemRoutes");
app.use("/api/spare-parts", sparePartItemRoutes);

// Order routes
const orderRoutes = require("./routes/orderRoutes");
app.use("/api/orders", orderRoutes);

// Payment routes
const paymentRoutes = require("./routes/paymentRoutes");
app.use("/api/payments", paymentRoutes);

// Serve uploads folder as static
app.use("/uploads", express.static("uploads"));

// Booking Routes
const bookingRoutes = require("./routes/bookingRoutes");
app.use("/api/booking", bookingRoutes);

// Review Routes
const reviewRoutes = require("./routes/reviewRoutes");
app.use("/api/review", reviewRoutes);

// Feedback Routes
const FeedbackRoutes = require("./routes/feedBackRoute")
app.use("/api/feedback",FeedbackRoutes)

// Contact Routes
const contactRoutes = require("./routes/contactRoutes");
app.use("/api/contact", contactRoutes);

// Newsletter routes
const newsletterRoutes = require("./routes/newsletterRoutes");
app.use("/api/newsletter", newsletterRoutes);

// Home sections routes (flash/new/best)
const homeSectionRoutes = require("./routes/homeSectionRoutes");
app.use("/api/home-sections", homeSectionRoutes);

// Incident/Report routes
const reportRoutes = require("./routes/reportRoutes");
app.use("/api/reports", reportRoutes);

// Starting the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
