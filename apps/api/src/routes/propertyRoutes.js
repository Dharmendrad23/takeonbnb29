import express from "express";
import mongoose from "mongoose";
import Property from "../models/Property.js";

const router = express.Router();

/* =====================================================
   CREATE PROPERTY - HOST SUBMISSION
===================================================== */

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
      pricePerNight === undefined ||
      pricePerNight === null ||
      pricePerNight === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required property details",
      });
    }

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

    const property = await Property.create({
      hostId,
      title: String(title).trim(),
      description: String(description).trim(),
      location: String(location).trim(),
      propertyType: String(propertyType).toLowerCase(),
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
      message:
        "Property submitted successfully and is pending admin approval",
      property,
    });
  } catch (error) {
    console.error("CREATE PROPERTY ERROR:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message || "Failed to submit property",
    });
  }
});


/* =====================================================
   TEST PROPERTY DATABASE

   GET /api/properties/test-db

   IMPORTANT:
   Ye route /:id se pehle hona chahiye
===================================================== */

router.get("/test-db", async (req, res) => {
  try {
    console.log("=================================");
    console.log("TEST DB ROUTE CALLED");

    const connectionState =
      mongoose.connection.readyState;

    console.log(
      "MongoDB readyState:",
      connectionState
    );

    console.log(
      "MongoDB host:",
      mongoose.connection.host
    );

    console.log(
      "MongoDB database:",
      mongoose.connection.name
    );

    if (connectionState !== 1) {
      return res.status(503).json({
        success: false,
        message: "MongoDB is not connected",
        readyState: connectionState,
      });
    }

    const count =
      await Property.countDocuments({});

    console.log(
      "TOTAL PROPERTIES:",
      count
    );

    return res.status(200).json({
      success: true,
      message:
        "MongoDB Property database working",
      mongoReadyState: connectionState,
      database: mongoose.connection.name,
      totalProperties: count,
    });

  } catch (error) {
    console.error("=================================");
    console.error("TEST DB ERROR:");
    console.error(error);
    console.error("=================================");

    return res.status(500).json({
      success: false,
      name: error.name || null,
      message:
        error.message ||
        "Property database test failed",
      code: error.code || null,
      codeName: error.codeName || null,
      readyState:
        mongoose.connection.readyState,
      database:
        mongoose.connection.name || null,
    });
  }
});


/* =====================================================
   GET ALL PROPERTIES

   /api/properties
   /api/properties?status=pending
   /api/properties?status=approved
   /api/properties?hostId=xxxxx
===================================================== */

router.get("/", async (req, res) => {
  try {
    console.log("=================================");
    console.log("GET /api/properties called");
    console.log("Query params:", req.query);

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: "MongoDB is not connected",
        readyState: mongoose.connection.readyState,
      });
    }

    const query = {};

    if (req.query.status) {
      query.status =
        String(req.query.status).toLowerCase();
    }

    if (req.query.hostId) {
      query.hostId = req.query.hostId;
    }

    console.log(
      "MongoDB query:",
      query
    );

    const properties =
      await Property.find(query)
        .lean()
        .exec();

    properties.sort((a, b) => {
      return (
        new Date(b.createdAt || 0) -
        new Date(a.createdAt || 0)
      );
    });

    console.log(
      "Properties found:",
      properties.length
    );

    return res.status(200).json(properties);

  } catch (error) {
    console.error("=================================");
    console.error("GET PROPERTIES ERROR:");
    console.error(error);
    console.error("=================================");

    return res.status(500).json({
      success: false,
      name: error.name || null,
      message:
        error.message ||
        "Failed to fetch properties",
      code: error.code || null,
      codeName: error.codeName || null,
    });
  }
});


/* =====================================================
   GET SINGLE PROPERTY

   GET /api/properties/:id
===================================================== */

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    console.log(
      "GET SINGLE PROPERTY:",
      id
    );

    if (
      mongoose.connection.readyState !== 1
    ) {
      return res.status(503).json({
        success: false,
        message: "MongoDB is not connected",
        readyState:
          mongoose.connection.readyState,
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid property ID",
      });
    }

    const property =
      await Property.findById(id)
        .lean()
        .exec();

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    return res.status(200).json(property);

  } catch (error) {
    console.error(
      "GET SINGLE PROPERTY ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      name: error.name || null,
      message:
        error.message ||
        "Failed to fetch property",
      code: error.code || null,
    });
  }
});


/* =====================================================
   ADMIN APPROVE / REJECT PROPERTY

   PATCH /api/properties/:id/status

   Body:
   {
     "status": "approved"
   }
===================================================== */

router.patch("/:id/status", async (req, res) => {
  try {
    const {
      status,
      rejectionReason = "",
    } = req.body;

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid property ID",
      });
    }

    if (
      mongoose.connection.readyState !== 1
    ) {
      return res.status(503).json({
        success: false,
        message: "MongoDB is not connected",
      });
    }

    const normalizedStatus =
      String(status || "").toLowerCase();

    const allowedStatuses = [
      "pending",
      "approved",
      "rejected",
    ];

    if (
      !allowedStatuses.includes(
        normalizedStatus
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid property status",
      });
    }

    const updateData = {
      status: normalizedStatus,
      rejectionReason:
        normalizedStatus === "rejected"
          ? rejectionReason
          : "",
    };

    console.log(
      `Updating property ${id} to ${normalizedStatus}`
    );

    const property =
      await Property.findByIdAndUpdate(
        id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        `Property ${normalizedStatus} successfully`,
      property,
    });

  } catch (error) {
    console.error(
      "UPDATE STATUS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      name: error.name || null,
      message:
        error.message ||
        "Failed to update property status",
      code: error.code || null,
    });
  }
});


/* =====================================================
   UPDATE PROPERTY DETAILS
===================================================== */

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid property ID",
      });
    }

    const {
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

    const updateData = {};

    if (title !== undefined) {
      updateData.title =
        String(title).trim();
    }

    if (description !== undefined) {
      updateData.description =
        String(description).trim();
    }

    if (location !== undefined) {
      updateData.location =
        String(location).trim();
    }

    if (propertyType !== undefined) {
      updateData.propertyType =
        String(propertyType).toLowerCase();
    }

    if (pricePerNight !== undefined) {
      updateData.pricePerNight =
        Number(pricePerNight);
    }

    if (bedrooms !== undefined) {
      updateData.bedrooms =
        Number(bedrooms);
    }

    if (bathrooms !== undefined) {
      updateData.bathrooms =
        Number(bathrooms);
    }

    if (guestCapacity !== undefined) {
      updateData.guestCapacity =
        Number(guestCapacity);
    }

    if (amenities !== undefined) {
      updateData.amenities =
        Array.isArray(amenities)
          ? amenities
          : amenities
            ? [amenities]
            : [];
    }

    if (photos !== undefined) {
      updateData.photos =
        Array.isArray(photos)
          ? photos
          : photos
            ? [photos]
            : [];
    }

    const property =
      await Property.findByIdAndUpdate(
        id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Property updated successfully",
      property,
    });

  } catch (error) {
    console.error(
      "UPDATE PROPERTY ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      name: error.name || null,
      message:
        error.message ||
        "Failed to update property",
      code: error.code || null,
    });
  }
});


/* =====================================================
   DELETE PROPERTY
===================================================== */

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid property ID",
      });
    }

    const property =
      await Property.findByIdAndDelete(id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Property deleted successfully",
    });

  } catch (error) {
    console.error(
      "DELETE PROPERTY ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      name: error.name || null,
      message:
        error.message ||
        "Failed to delete property",
      code: error.code || null,
    });
  }
});

export default router;