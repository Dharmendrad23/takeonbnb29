import Property from "../models/Property.js";

// GET ALL PROPERTIES
export const getProperties = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 24;
    const skip = (page - 1) * limit;

    const filter = {};

    // Host dashboard: return ALL host properties regardless of approval/active status
    if (req.query.hostId) {
      filter.hostId = req.query.hostId;
    } else {
      filter.isActive = true;
      filter.approvalStatus = "approved";
    }

    if (req.query.city) {
      filter.city = req.query.city;
    }

    if (req.query.propertyType) {
      filter.propertyType = req.query.propertyType;
    }

    const properties = await Property.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Property.countDocuments(filter);

    res.json({
      success: true,
      page,
      total,
      totalPages: Math.ceil(total / limit),
      properties,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// GET PROPERTY BY ID
export const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    res.json({
      success: true,
      property,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// CREATE PROPERTY
export const createProperty = async (req, res) => {
  try {
    const property = await Property.create(req.body);

    res.status(201).json({
      success: true,
      property,
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// UPDATE PROPERTY
export const updateProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
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

    res.json({
      success: true,
      property,
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// DELETE PROPERTY
export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      {
        isActive: false,
      },
      {
        new: true,
      }
    );

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    res.json({
      success: true,
      message: "Property deleted successfully",
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};