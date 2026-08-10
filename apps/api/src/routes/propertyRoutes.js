import express from "express";
import Property from "../models/Property.js";

const router = express.Router();

// Get all approved properties
router.get("/", async (req, res) => {
  try {
   const properties = await Property.find({
  status: "approved",
})
  .select("-photos")
  .sort({ createdAt: -1 });

    res.status(200).json(properties);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch properties",
    });
  }
});

// Get property by id
router.get("/:id", async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    res.json(property);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

export default router;