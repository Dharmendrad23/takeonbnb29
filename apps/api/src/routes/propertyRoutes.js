import express from "express";
import Property from "../models/Property.js";

const router = express.Router();

// Create a new property
router.post("/", async (req, res) => {
  try {
    const {
      hostId,
      title,
      description,
      location,
      propertyType,
      pricePerNight,
      bedrooms,
      bathrooms,
      guestCapacity,
      amenities,
      photos,
    } = req.body;

    if (
      !hostId ||
      !title ||
      !description ||
      !location ||
      !propertyType ||
      !pricePerNight
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required property details",
      });
    }

    // Convert repeated URLSearchParams fields into arrays
    const amenitiesArray = Array.isArray(amenities)
      ? amenities
      : amenities
        ? [amenities]
        : [];

    const photosArray = Array.isArray(photos)
      ? photos
      : photos
        ? [photos]
        : [];

    if (photosArray.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please upload at least one property photo",
      });
    }

    const property = await Property.create({
      hostId,
      title: title.trim(),
      description: description.trim(),
      location: location.trim(),
      propertyType,
      pricePerNight: Number(pricePerNight),
      bedrooms: Number(bedrooms) || 1,
      bathrooms: Number(bathrooms) || 1,
      guestCapacity: Number(guestCapacity) || 1,
      amenities: amenitiesArray,
      photos: photosArray,
      status: "pending",
    });

    return res.status(201).json({
      success: true,
      message: "Property submitted successfully and is pending approval",
      property,
    });

  } catch (error) {
    console.error("Create property error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to submit property",
    });
  }
});

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
        success: false,
        message: "Property not found",
      });
    }

    res.json(property);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
