import Property from "../models/Property.js";


// ============================================================
// GET ALL PROPERTIES
// ============================================================

export const getProperties = async (req, res) => {
  try {
    const query = {};

    if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.hostId) {
      query.hostId = req.query.hostId;
    }

    const properties = await Property.find(query).lean();

    properties.sort((a, b) => {
      return (
        new Date(b.createdAt || 0) -
        new Date(a.createdAt || 0)
      );
    });

    return res.json(properties);

  } catch (err) {
    console.error(
      "GET PROPERTIES ERROR:",
      err
    );

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// ============================================================
// GET PROPERTY BY ID
// ============================================================

export const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(
      req.params.id
    );

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    return res.json({
      success: true,
      property,
    });

  } catch (err) {
    console.error(
      "GET PROPERTY BY ID ERROR:",
      err
    );

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// ============================================================
// CREATE PROPERTY
// ============================================================

export const createProperty = async (req, res) => {
  try {
    console.log(
      "CREATE PROPERTY BODY:",
      req.body
    );

    console.log(
      "CREATE PROPERTY FILES:",
      req.files
    );


    // ========================================================
    // PARSE AMENITIES
    // Frontend sends:
    // JSON.stringify(formData.amenities)
    // ========================================================

    let amenities = [];

    if (req.body.amenities) {
      try {
        amenities =
          typeof req.body.amenities === "string"
            ? JSON.parse(req.body.amenities)
            : req.body.amenities;

        // Ensure amenities is always an array
        if (!Array.isArray(amenities)) {
          amenities = [];
        }

      } catch (error) {
        console.error(
          "AMENITIES PARSE ERROR:",
          error
        );

        amenities = [];
      }
    }


    // ========================================================
    // GET CLOUDINARY IMAGE URLs
    //
    // multer-storage-cloudinary normally provides:
    // file.path = Cloudinary secure URL
    // ========================================================

    const images = (req.files || [])
      .map((file) => {
        return (
          file.secure_url ||
          file.path ||
          file.url ||
          file.location ||
          null
        );
      })
      .filter(Boolean);


    // ========================================================
    // VALIDATE IMAGES
    // ========================================================

    if (images.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "Please upload at least one property image",
      });
    }

    if (images.length > 100) {
      return res.status(400).json({
        success: false,
        message:
          "Maximum 100 images are allowed",
      });
    }


    // ========================================================
    // CREATE PROPERTY DATA
    // ========================================================

    const propertyData = {
      // Host

      hostId: req.body.hostId,


      // Basic Details

      title: req.body.title,

      description:
        req.body.description,

      propertyType:
        req.body.propertyType,

      propertyCategory:
        req.body.propertyCategory ||
        "All",


      // ======================================================
      // GUESTS & ROOMS
      // ======================================================

      maxGuests:
        Number(req.body.maxGuests) || 1,

      bedrooms:
        Number(req.body.bedrooms) || 0,

      beds:
        Number(req.body.beds) || 0,

      bathrooms:
        Number(req.body.bathrooms) || 0,


      // ======================================================
      // LOCATION
      // ======================================================

      address:
        req.body.address || "",

      city:
        req.body.city || "",

      state:
        req.body.state || "",

      country:
        req.body.country || "India",

      pincode:
        req.body.pincode || "",


      // ======================================================
      // MAP COORDINATES
      // ======================================================

      latitude:
        req.body.latitude !== ""
          ? Number(req.body.latitude)
          : undefined,

      longitude:
        req.body.longitude !== ""
          ? Number(req.body.longitude)
          : undefined,


      // ======================================================
      // PRICING
      // ======================================================

      pricePerNight:
        Number(req.body.pricePerNight) || 0,


      // ======================================================
      // AMENITIES
      // ======================================================

      amenities,


      // ======================================================
      // CLOUDINARY IMAGE URLs
      // ======================================================

      images,


      // ======================================================
      // CHECK-IN / CHECK-OUT
      // ======================================================

      checkInTime:
        req.body.checkInTime || "",

      checkOutTime:
        req.body.checkOutTime || "",


      // ======================================================
      // HOUSE RULES
      // ======================================================

      houseRules:
        req.body.houseRules || "",


      // ======================================================
      // ADMIN APPROVAL
      // ======================================================

      status: "pending",
    };


    // ========================================================
    // CREATE IN MONGODB
    // ========================================================

    const property =
      await Property.create(
        propertyData
      );


    console.log(
      "PROPERTY CREATED SUCCESSFULLY:",
      property._id
    );


    return res.status(201).json({
      success: true,

      message:
        "Property submitted successfully! Waiting for admin approval.",

      property,
    });

  } catch (err) {
    console.error(
      "CREATE PROPERTY ERROR:",
      err
    );

    return res.status(400).json({
      success: false,

      message:
        err.message ||
        "Failed to submit property",
    });
  }
};


// ============================================================
// UPDATE PROPERTY
// ============================================================

export const updateProperty = async (req, res) => {
  try {
    const property =
      await Property.findByIdAndUpdate(
        req.params.id,
        req.body,
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

    return res.json({
      success: true,
      message:
        "Property updated successfully",
      property,
    });

  } catch (err) {
    console.error(
      "UPDATE PROPERTY ERROR:",
      err
    );

    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};


// ============================================================
// DELETE PROPERTY
// ============================================================

export const deleteProperty = async (req, res) => {
  try {
    const property =
      await Property.findByIdAndDelete(
        req.params.id
      );

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    return res.json({
      success: true,
      message:
        "Property deleted successfully",
    });

  } catch (err) {
    console.error(
      "DELETE PROPERTY ERROR:",
      err
    );

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};