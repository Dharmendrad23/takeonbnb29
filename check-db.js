import mongoose from "mongoose";
import Property from "./src/models/Property.js";

try {
  await mongoose.connect(process.env.MONGODB_URI);

  console.log("MongoDB Connected");
  console.log("Database:", mongoose.connection.name);

  const properties = await Property.find({}).lean();

  console.log("\nTOTAL PROPERTIES:", properties.length);

  console.log("\nALL PROPERTIES:");
  console.log(JSON.stringify(properties, null, 2));

  console.log("\nSTATUS SUMMARY:");

  const pending = await Property.countDocuments({
    status: "pending",
  });

  const approved = await Property.countDocuments({
    status: "approved",
  });

  const rejected = await Property.countDocuments({
    status: "rejected",
  });

  console.log({
    pending,
    approved,
    rejected,
  });

  await mongoose.disconnect();

} catch (error) {
  console.error("DATABASE ERROR:");
  console.error(error);
  process.exit(1);
}