require("dotenv").config(); // Load .env FIRST

const express = require("express");
const connectDB = require("./config/connection");
const productRoutes = require("./routes/productRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware to parse JSON
app.use(express.json());

// Optional base route
app.get("/", (req, res) => {
  res.json({ message: "🛒 Zenith Product API is running" });
});

// Mount product routes at /api/products
app.use("/api/products", productRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
