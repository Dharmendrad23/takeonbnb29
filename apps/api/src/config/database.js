import mongoose from "mongoose";
import dns from "node:dns";

dns.setServers([
  "8.8.8.8",
  "1.1.1.1",
]);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
    });

    console.log("MongoDB Connected");
    console.log("Database:", mongoose.connection.name);
  } catch (err) {
    console.error("MongoDB Connection Error:", err.message);
    process.exit(1);
  }
};

export default connectDB;