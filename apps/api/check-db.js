import dotenv from "dotenv";
import mongoose from "mongoose";
import dns from "node:dns";
import Property from "./src/models/Property.js";

dotenv.config();

// Fix MongoDB Atlas DNS lookup
dns.setServers(["8.8.8.8", "1.1.1.1"]);

try {
  console.log("Connecting to MongoDB...");

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI not found in .env file");
  }

  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 15000,
  });

  console.log("MongoDB Connected");
  console.log("Database:", mongoose.connection.name);

  const properties = await Property.find({}).lean();

  console.log("\n==============================");
  console.log("TOTAL PROPERTIES:", properties.length);
  console.log("==============================\n");

  properties.forEach((property, index) => {
    console.log(`PROPERTY ${index + 1}`);
    console.log("ID:", property._id);
    console.log("Title:", property.title);
    console.log("Status:", property.status);
    console.log("Location:", property.location);
    console.log("--------------------------");
  });

  const pending = await Property.countDocuments({ status: "pending" });
  const approved = await Property.countDocuments({ status: "approved" });
  const rejected = await Property.countDocuments({ status: "rejected" });

  console.log("\nSTATUS SUMMARY");
  console.log({
    pending,
    approved,
    rejected,
  });

  await mongoose.disconnect();
  process.exit(0);

} catch (error) {
  console.error("\nDATABASE ERROR:");
  console.error(error.message || error);
  process.exit(1);
}