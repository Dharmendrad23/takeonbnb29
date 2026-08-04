import Booking from "../models/Booking.js";
import Property from "../models/Property.js";
import User from "../models/User.js";

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const fileToDataUrl = (file) =>
  file?.buffer ? `data:${file.mimetype};base64,${file.buffer.toString("base64")}` : "";

const decorateProperty = (property, hostMap) => {
  if (!property) {
    return null;
  }

  const payload = property.toJSON ? property.toJSON() : { ...property };
  payload.host = payload.hostId ? hostMap.get(String(payload.hostId)) || null : null;
  return payload;
};

const createPropertyMap = async (propertyIds = []) => {
  const properties = await Property.find({ _id: { $in: propertyIds } });
  const hostIds = [...new Set(properties.map((property) => property.hostId).filter(Boolean))];
  const hosts = await User.find({ _id: { $in: hostIds } });
  const hostMap = new Map(hosts.map((host) => [String(host._id), host.toJSON ? host.toJSON() : host]));

  return new Map(
    properties.map((property) => [String(property._id), decorateProperty(property, hostMap)])
  );
};

const normalizeBookingPayload = (payload = {}, file) => {
  const nextPayload = { ...payload };

  if (Object.prototype.hasOwnProperty.call(nextPayload, "guestCount")) {
    nextPayload.guestCount = toNumber(nextPayload.guestCount, 1);
  }

  if (Object.prototype.hasOwnProperty.call(nextPayload, "totalPrice")) {
    nextPayload.totalPrice = toNumber(nextPayload.totalPrice, 0);
  }

  if (Object.prototype.hasOwnProperty.call(nextPayload, "totalAmount")) {
    nextPayload.totalAmount = toNumber(nextPayload.totalAmount, 0);
  }

  if (file) {
    nextPayload.paymentScreenshot = fileToDataUrl(file);
  }

  return nextPayload;
};

// GET ALL BOOKINGS
export const getBookings = async (req, res) => {
  try {
    const filters = {};

    if (req.query.propertyId) {
      filters.propertyId = req.query.propertyId;
    }

    if (req.query.guestId) {
      filters.guestId = req.query.guestId;
    }

    if (req.query.status) {
      filters.status = req.query.status;
    }
    const bookings = await Booking.find(filters).sort({ createdAt: -1 });
    const propertyIds = [...new Set(bookings.map((booking) => booking.propertyId).filter(Boolean))];
    const propertyMap = await createPropertyMap(propertyIds);

    const guestIds = [...new Set(bookings.map((booking) => booking.guestId).filter(Boolean))];
    const guests = await User.find({ _id: { $in: guestIds } });
    const guestMap = new Map(guests.map((guest) => [String(guest._id), guest]));

    const enrichedBookings = bookings.map((booking) => {
      const payload = booking.toJSON();
      payload.property = payload.propertyId ? propertyMap.get(String(payload.propertyId)) || null : null;
      payload.guest = payload.guestId ? guestMap.get(String(payload.guestId)) || null : null;
      return payload;
    });

    res.json(enrichedBookings);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// GET BOOKING BY ID
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const payload = booking.toJSON();
    const propertyMap = await createPropertyMap(payload.propertyId ? [payload.propertyId] : []);
    payload.property = payload.propertyId ? propertyMap.get(String(payload.propertyId)) || null : null;
    payload.guest = payload.guestId ? await User.findById(payload.guestId) : null;

    res.json(payload);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// CREATE BOOKING
export const createBooking = async (req, res) => {
  try {
    const booking = await Booking.create(normalizeBookingPayload(req.body, req.file));

    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// UPDATE BOOKING
export const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      normalizeBookingPayload(req.body, req.file),
      {
        new: true,
        runValidators: true,
      }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.json({
      success: true,
      data: booking,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// DELETE BOOKING
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.json({
      success: true,
      message: "Booking deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};