import express from "express";
import {
  getBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
} from "../controllers/bookingController.js";
import { bookingUpload } from "../middleware/uploads.js";

const router = express.Router();

router.get("/", getBookings);

router.get("/:id", getBookingById);

router.post("/", bookingUpload, createBooking);

router.put("/:id", bookingUpload, updateBooking);

router.delete("/:id", deleteBooking);

export default router;