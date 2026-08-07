import Property from "../models/Property.js";

// GET ALL PROPERTIES
export const getProperties = async (req, res) => {
  try {
    const query = {};

    if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.hostId) {
      query.hostId = req.query.hostId;
    }

    // Fetch first, then sort in Node.js
    const properties = await Property.find(query).lean();

    properties.sort((a, b) => {
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

    return res.json(properties);
  } catch (err) {
    console.error("GET PROPERTIES ERROR:", err);
    return res.status(500).json({
      message: err.message,
    });
  }
};

// GET PROPERTY BY ID
export const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    return res.json(property);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// CREATE PROPERTY
export const createProperty = async (req, res) => {
  try {
    const property = await Property.create(req.body);
    return res.status(201).json(property);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// UPDATE PROPERTY
export const updateProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    return res.json(property);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// DELETE PROPERTY
export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    return res.json({ message: "Property deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};