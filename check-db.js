import mongoose from "mongoose";
import Property from "./src/models/Property.js";

try {
  await mongoose.connect(process.env.MONGODB_URI);

  console.log("MongoDB Connected");
  console.log("Database:", mongoose.connection.name);

  const properties = await Property.find({}).lean();

  console.log("\nTOTAL PROPERTIES:", properties.length);

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

  console.log("\nALL PROPERTIES:");
  console.log(
    properties.map((p) => ({
      id: p._id,
      title: p.title || p.name,
      status: p.status,
      propertyType: p.propertyType || p.type,
      location: p.location,
      pricePerNight: p.pricePerNight,
      coverImage: p.coverImage,
      photos: p.photos,
    }))
  );

  await mongoose.disconnect();

  console.log("\nDONE");
} catch (error) {
  console.error("\nDATABASE ERROR:");
  console.error(error);
  process.exit(1);
}