import multer from "multer";
import { BodyLimit } from "../constants/common.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: BodyLimit,
  },
});

export const propertyUpload = upload.array("photos", 10);
export const bookingUpload = upload.single("paymentScreenshot");
