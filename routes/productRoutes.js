// routes/productRoutes.js

const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

/**
 * POST /api/products
 * Create a product
 */
router.post("/", async (req, res) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();
    return res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Error creating product:", error.message);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: "Validation failed",
        details: error.message,
      });
    }

    return res.status(500).json({ error: "Failed to create product" });
  }
});

/**
 * GET /api/products/:id
 * Get a single product by ID
 */
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error.message);
    return res.status(400).json({ error: "Invalid product ID" });
  }
});

/**
 * PUT /api/products/:id
 * Update a product by ID
 */
router.put("/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // return updated doc
        runValidators: true, // enforce schema validation
      }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error.message);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: "Validation failed",
        details: error.message,
      });
    }

    return res.status(400).json({ error: "Failed to update product" });
  }
});

/**
 * DELETE /api/products/:id
 * Delete a product by ID
 */
router.delete("/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error.message);
    return res.status(400).json({ error: "Failed to delete product" });
  }
});

/**
 * GET /api/products
 * Read all products with advanced querying
 */
router.get("/", async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      sortBy,
      page = 1,
      limit = 10,
    } = req.query;

    // Build filter object
    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) {
        filter.price.$gte = Number(minPrice);
      }
      if (maxPrice) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    // Build sort object
    let sort = {};
    if (sortBy === "price_asc") {
      sort.price = 1;
    } else if (sortBy === "price_desc") {
      sort.price = -1;
    }

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    return res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error.message);
    return res.status(500).json({ error: "Failed to fetch products" });
  }
});

module.exports = router;
