import dotenv from "dotenv";
import mongoose from "mongoose";
import dns from "node:dns";

dotenv.config();

dns.setServers([
  "8.8.8.8",
  "1.1.1.1",
]);

try {
  console.log("Connecting to MongoDB...");

  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 15000,
    connectTimeoutMS: 15000,
  });

  console.log("MongoDB Connected");
  console.log("Database:", mongoose.connection.name);

  const collection =
    mongoose.connection.db.collection("properties");

  console.log("Running raw MongoDB findOne...");

  const property = await collection.findOne({});

  console.log("RAW PROPERTY RESULT:");
  console.log(property);

  await mongoose.disconnect();

  console.log("DONE");
  process.exit(0);

} catch (error) {
  console.error("DATABASE ERROR:");
  console.error(error);
  process.exit(1);
}