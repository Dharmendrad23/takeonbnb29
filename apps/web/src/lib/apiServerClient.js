import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import propertyRoutes from "./routes/propertyRoutes.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN.split(","),
  credentials: true,
}));

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.use("/api/properties", propertyRoutes);

app.get("/", (req, res) => {
  res.json({ message: "TakeOnBNB API Running" });
});

app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});