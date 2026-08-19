import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import Property from "../models/Property.js";

const router = express.Router();

/* =====================================================
   MULTER - MEMORY STORAGE
===================================================== */

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype?.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

/* =====================================================
   CLOUDINARY CONFIG
===================================================== */

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* =====================================================
   CLOUDINARY UPLOAD HELPER
===================================================== */

const uploadToCloudinary = (buffer, folder = "takeonbnb/properties") =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    stream.end(buffer);
  });

/* =====================================================
   HELPERS
===================================================== */

const parseArray = (value) => {
  if (!value) return [];

  if (Array.isArray(value)) return value;

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);

      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch {
      return [value];
    }
  }

  return [];
};

const toNumber = (value, fallback = 0) => {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return fallback;
  }

  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : fallback;
};

/* =====================================================
   DATABASE TEST
===================================================== */

router.get("/test-db", async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;

    if (dbState !== 1) {
      return res.status(503).json({
        success: false,
        message: "MongoDB is not connected",
        dbState,
      });
    }

    const totalProperties =
      await Property.countDocuments({}).exec();

    return res.status(200).json({
      success: true,
      message: "Database connection working",
      database: mongoose.connection.name,
      totalProperties,
    });
  } catch (error) {
    console.error("TEST DB ERROR:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message || "Database test failed",
    });
  }
});

/* =====================================================
   GET ALL PROPERTIES
===================================================== */

router.get("/", async (req, res) => {
  try {
    const query = {};

    if (req.query.status) {
      query.status = String(req.query.status)
        .trim()
        .toLowerCase();
    }

    if (req.query.hostId) {
      query.hostId = String(req.query.hostId).trim();
    }

    const properties = await Property.find(query)
      .sort({ createdAt: -1 })
      .limit(100)
      .lean()
      .exec();

    const formattedProperties = properties.map(
      (property) => ({
        ...property,
        id: String(property._id),

        // Backward compatibility
        guestCapacity:
          property.maxGuests ??
          property.guests ??
          1,

        photos:
          property.images ??
          property.photos ??
          [],
      })
    );

    return res.status(200).json({
      success: true,
      count: formattedProperties.length,
      properties: formattedProperties,
    });
  } catch (error) {
    console.error(
      "GET ALL PROPERTIES ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch properties",
    });
  }
});

/* =====================================================
   CREATE PROPERTY
   Images -> Cloudinary
   Data -> MongoDB
===================================================== */

router.post(
  "/",
  upload.array("images", 20),
  async (req, res) => {
    try {
      const {
        hostId,
        title,
        description,
        propertyType,
        propertyCategory,

        maxGuests,
        bedrooms,
        beds,
        bathrooms,

        address,
        city,
        state,
        country,
        pincode,
        latitude,
        longitude,

        pricePerNight,

        amenities,

        checkInTime,
        checkOutTime,
        houseRules,
      } = req.body;

      if (
        !hostId ||
        !title ||
        !description ||
        !propertyType ||
        !city ||
        pricePerNight === undefined ||
        pricePerNight === null ||
        pricePerNight === ""
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Please fill all required property details",
        });
      }

      const uploadedImages = [];

      if (req.files?.length) {
        for (const file of req.files) {
          const result =
            await uploadToCloudinary(file.buffer);

          uploadedImages.push(result.secure_url);
        }
      }

      const amenitiesArray = parseArray(amenities);

      const fullLocation = [
        address,
        city,
        state,
        country,
      ]
        .filter(Boolean)
        .join(", ");

      const property = await Property.create({
        hostId: String(hostId),

        title: String(title).trim(),

        description:
          String(description).trim(),

        propertyType:
          String(propertyType)
            .trim()
            .toLowerCase(),

        propertyCategory:
          String(
            propertyCategory || "All"
          ).trim(),

        maxGuests: toNumber(maxGuests, 1),

        bedrooms: toNumber(bedrooms, 0),

        beds: toNumber(beds, 0),

        bathrooms: toNumber(bathrooms, 0),

        address:
          String(address || "").trim(),

        location: fullLocation,

        city:
          String(city || "").trim(),

        state:
          String(state || "").trim(),

        country:
          String(country || "India").trim(),

        pincode:
          String(pincode || "").trim(),

        latitude:
          latitude !== undefined &&
          latitude !== ""
            ? Number(latitude)
            : null,

        longitude:
          longitude !== undefined &&
          longitude !== ""
            ? Number(longitude)
            : null,

        pricePerNight:
          toNumber(pricePerNight, 0),

        // Compatibility with old pages
        price:
          toNumber(pricePerNight, 0),

        amenities: amenitiesArray,

        images: uploadedImages,

        coverImage:
          uploadedImages[0] || "",

        checkInTime:
          String(checkInTime || ""),

        checkOutTime:
          String(checkOutTime || ""),

        houseRules:
          String(houseRules || ""),

        // Host submits → Admin approves
        status: "pending",
      });

      return res.status(201).json({
        success: true,
        message:
          "Property submitted successfully for admin approval",
        property: {
          ...property.toObject(),
          id: String(property._id),

          // Old frontend compatibility
          guestCapacity:
            property.maxGuests,

          photos:
            property.images,
        },
      });
    } catch (error) {
      console.error(
        "CREATE PROPERTY ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Failed to create property",
      });
    }
  }
);

/* =====================================================
   UPDATE PROPERTY STATUS
===================================================== */

router.patch("/:id/status", async (req, res) => {
  try {
    if (
      !mongoose.Types.ObjectId.isValid(
        req.params.id
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid property ID",
      });
    }

    const {
      status,
      rejectionReason = "",
    } = req.body;

    const normalizedStatus = String(
      status || ""
    )
      .trim()
      .toLowerCase();

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

    const property =
      await Property.findByIdAndUpdate(
        req.params.id,
        {
          status: normalizedStatus,
          rejectionReason:
            normalizedStatus === "rejected"
              ? String(rejectionReason)
              : "",
        },
        {
          new: true,
          runValidators: true,
        }
      ).exec();

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
      message:
        error.message ||
        "Failed to update property status",
    });
  }
});

/* =====================================================
   UPDATE PROPERTY
===================================================== */

router.put("/:id", async (req, res) => {
  try {
    if (
      !mongoose.Types.ObjectId.isValid(
        req.params.id
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid property ID",
      });
    }

    const allowedFields = [
      "title",
      "description",
      "propertyType",
      "propertyCategory",
      "maxGuests",
      "bedrooms",
      "beds",
      "bathrooms",
      "address",
      "location",
      "city",
      "state",
      "country",
      "pincode",
      "latitude",
      "longitude",
      "pricePerNight",
      "price",
      "amenities",
      "images",
      "coverImage",
      "checkInTime",
      "checkOutTime",
      "houseRules",
    ];

    const updateData = {};

    allowedFields.forEach((field) => {
      if (
        req.body[field] !== undefined
      ) {
        updateData[field] =
          req.body[field];
      }
    });

    [
      "maxGuests",
      "bedrooms",
      "beds",
      "bathrooms",
      "pricePerNight",
      "price",
      "latitude",
      "longitude",
    ].forEach((field) => {
      if (
        updateData[field] !== undefined &&
        updateData[field] !== ""
      ) {
        updateData[field] =
          Number(updateData[field]);
      }
    });

    if (
      updateData.amenities !== undefined
    ) {
      updateData.amenities =
        parseArray(
          updateData.amenities
        );
    }

    if (
      updateData.images !== undefined
    ) {
      updateData.images =
        parseArray(
          updateData.images
        );
    }

    if (
      updateData.propertyType !== undefined
    ) {
      updateData.propertyType =
        String(
          updateData.propertyType
        )
          .trim()
          .toLowerCase();
    }

    const property =
      await Property.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      ).exec();

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
      message:
        error.message ||
        "Failed to update property",
    });
  }
});

/* =====================================================
   DELETE PROPERTY
===================================================== */

router.delete("/:id", async (req, res) => {
  try {
    if (
      !mongoose.Types.ObjectId.isValid(
        req.params.id
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid property ID",
      });
    }

    const property =
      await Property.findByIdAndDelete(
        req.params.id
      ).exec();

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
      message:
        error.message ||
        "Failed to delete property",
    });
  }
});

/* =====================================================
   GET SINGLE PROPERTY
===================================================== */

router.get("/:id", async (req, res) => {
  try {
    if (
      !mongoose.Types.ObjectId.isValid(
        req.params.id
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid property ID",
      });
    }

    const property = await Property.findById(
      req.params.id
    )
      .lean()
      .exec();

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    return res.status(200).json({
      success: true,

      property: {
        ...property,

        id: String(property._id),

        // Old pages compatibility
        guestCapacity:
          property.maxGuests ??
          property.guests ??
          1,

        photos:
          property.images ??
          property.photos ??
          [],
      },
    });
  } catch (error) {
    console.error(
      "GET SINGLE PROPERTY ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch property",
    });
  }
});

export default router;