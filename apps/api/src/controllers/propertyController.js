import Property from "../models/Property.js";

// GET ALL PROPERTIES
export const getProperties = async (req, res) => {
  try {
    const properties = await Property.find().sort({ createdAt: -1 });
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET PROPERTY BY ID
export const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.json(property);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE PROPERTY
export const createProperty = async (req, res) => {
  try {
    const property = await Property.create(req.body);
    res.status(201).json(property);
  } catch (err) {
    res.status(400).json({ message: err.message });
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

    res.json(property);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE PROPERTY
export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.json({ message: "Property deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};export const getProperties = async (req, res) => {
  try {
    const filter = {};

    if (req.query.hostId) {
      filter.hostId = req.query.hostId;
    }

    const properties = await Property.find(filter).sort({
      createdAt: -1,
    });

    res.json(properties);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};