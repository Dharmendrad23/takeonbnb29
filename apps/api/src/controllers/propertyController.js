import Property from "../models/Property.js";
import Review from "../models/Review.js";
import User from "../models/User.js";

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toArray = (value) => {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  if (value == null || value === "") {
    return [];
  }

  return [value];
};

const fileToDataUrl = (file) =>
  file?.buffer ? `data:${file.mimetype};base64,${file.buffer.toString("base64")}` : "";

const buildUserMap = async (userIds = []) => {
  const uniqueUserIds = [...new Set(userIds.filter(Boolean).map(String))];
  if (uniqueUserIds.length === 0) {
    return new Map();
  }

  const users = await User.find({ _id: { $in: uniqueUserIds } });
  return new Map(users.map((user) => [String(user._id), user.toJSON ? user.toJSON() : user]));
};

const decorateProperty = (property, hostMap) => {
  if (!property) {
    return null;
  }

  const payload = property.toJSON ? property.toJSON() : { ...property };
  payload.host = payload.hostId ? hostMap.get(String(payload.hostId)) || null : null;
  return payload;
};

const normalizePropertyPayload = (payload = {}, files = [], existingProperty = null) => {
  const nextPayload = { ...payload };

  ["pricePerNight", "bedrooms", "bathrooms", "guestCapacity", "rating", "totalBookings"].forEach(
    (field) => {
      if (Object.prototype.hasOwnProperty.call(nextPayload, field)) {
        nextPayload[field] = toNumber(nextPayload[field], 0);
      }
    }
  );

  const nextAmenities = toArray(nextPayload.amenities);
  if (nextAmenities.length > 0 || Object.prototype.hasOwnProperty.call(nextPayload, "amenities")) {
    nextPayload.amenities = nextAmenities;
  }

  const existingPhotos = existingProperty ? toArray(existingProperty.photos) : [];
  const uploadedPhotos = files.map(fileToDataUrl).filter(Boolean);

  if (uploadedPhotos.length > 0) {
    nextPayload.photos = [...existingPhotos, ...uploadedPhotos];
  } else if (!Object.prototype.hasOwnProperty.call(nextPayload, "photos") && existingProperty) {
    nextPayload.photos = existingPhotos;
  } else if (Object.prototype.hasOwnProperty.call(nextPayload, "photos")) {
    nextPayload.photos = toArray(nextPayload.photos);
  }

  const existingCoverImage = existingProperty?.coverImage || "";
  if (!nextPayload.coverImage) {
    nextPayload.coverImage = existingCoverImage || nextPayload.photos?.[0] || "";
  }

  return nextPayload;
};

// GET ALL PROPERTIES
export const getProperties = async (req, res) => {
  try {
    const filter = {};

    if (req.query.hostId) {
      filter.hostId = req.query.hostId;
    }

    const properties = await Property.find(filter).sort({ createdAt: -1 });
    const hostMap = await buildUserMap(properties.map((property) => property.hostId));
    res.json(properties.map((property) => decorateProperty(property, hostMap)));
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

    const hostMap = await buildUserMap([property.hostId]);
    const payload = decorateProperty(property, hostMap);

    const reviews = await Review.find({ propertyId: property._id }).sort({ createdAt: -1 });
    const guestMap = await buildUserMap(reviews.map((review) => review.guestId));
    payload.reviews = reviews.map((review) => {
      const reviewPayload = review.toJSON ? review.toJSON() : { ...review };
      reviewPayload.guest = reviewPayload.guestId
        ? guestMap.get(String(reviewPayload.guestId)) || null
        : null;
      return reviewPayload;
    });

    res.json(payload);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE PROPERTY
export const createProperty = async (req, res) => {
  try {
    const property = await Property.create(normalizePropertyPayload(req.body, req.files || []));
    const hostMap = await buildUserMap([property.hostId]);
    res.status(201).json(decorateProperty(property, hostMap));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// UPDATE PROPERTY
export const updateProperty = async (req, res) => {
  try {
    const existingProperty = await Property.findById(req.params.id);

    if (!existingProperty) {
      return res.status(404).json({ message: "Property not found" });
    }

    const property = await Property.findByIdAndUpdate(
      req.params.id,
      normalizePropertyPayload(req.body, req.files || [], existingProperty),
      {
        new: true,
        runValidators: true,
      }
    );

    const hostMap = await buildUserMap([property.hostId]);
    res.json(decorateProperty(property, hostMap));
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
};
