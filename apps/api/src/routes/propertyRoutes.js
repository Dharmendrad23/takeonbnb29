import express from "express";

import {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
} from "../controllers/propertyController.js";
import { propertyUpload } from "../middleware/uploads.js";

const router = express.Router();

router.get("/", getProperties);
router.get("/:id", getPropertyById);
router.post("/", propertyUpload, createProperty);

router.put("/:id", propertyUpload, updateProperty);
router.delete("/:id", deleteProperty);

export default router;