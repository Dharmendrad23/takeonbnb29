import Property from "../models/Property.js";

// GET ALL PROPERTIES
export const getProperties = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const filter = {};

    // By default only show approved, active properties (unless hostId or admin filter)
    if (!req.query.hostId && !req.query.all) {
      filter.isActive = true;
      filter.approvalStatus = "approved";
    }

    if (req.query.hostId) {
      filter.hostId = req.query.hostId;
      // Remove approval filter for host's own properties
      delete filter.approvalStatus;
      delete filter.isActive;
    }

    if (req.query.city) {
      filter.city = new RegExp(req.query.city, "i");
    }

    if (req.query.propertyType) {
      filter.propertyType = req.query.propertyType;
    }

    if (req.query.status) {
      // Map 'Live' -> approved
      if (req.query.status === "Live") {
        filter.approvalStatus = "approved";
        filter.isActive = true;
      } else {
        filter.approvalStatus = req.query.status.toLowerCase();
      }
    }

    if (req.query.approvalStatus) {
      filter.approvalStatus = req.query.approvalStatus;
    }

    if (req.query.search) {
      const s = new RegExp(req.query.search, "i");
      filter.$or = [{ title: s }, { location: s }, { city: s }, { state: s }];
    }

    // Exclude a specific id (for "similar properties" query)
    if (req.query.idNot) {
      filter._id = { $ne: req.query.idNot };
    }

    const properties = await Property.find(filter)
      .populate("hostId", "-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Property.countDocuments(filter);

    res.json({
      success: true,
      page,
      total,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
      properties,
      items: properties,
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
    const property = await Property.findById(req.params.id).populate(
      "hostId",
      "-password"
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
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// CREATE PROPERTY
export const createProperty = async (req, res) => {
  try {
    const data = { ...req.body };

    // Attach hostId from JWT if not provided
    if (!data.hostId && req.user?.id) {
      data.hostId = req.user.id;
    }

    const property = await Property.create(data);

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
      { isActive: false },
      { new: true }
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


