import dotenv from "dotenv";
import dns from "node:dns";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import Property from "./src/models/Property.js";

dotenv.config();

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const isDryRun = !process.argv.includes("--run");

function isBase64Image(value) {
  return (
    typeof value === "string" &&
    /^data:image\/[a-zA-Z0-9.+-]+;base64,/.test(value)
  );
}

async function main() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing.");
  }

  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    throw new Error("CLOUDINARY_CLOUD_NAME is missing.");
  }

  if (!process.env.CLOUDINARY_API_KEY) {
    throw new Error("CLOUDINARY_API_KEY is missing.");
  }

  if (!process.env.CLOUDINARY_API_SECRET) {
    throw new Error("CLOUDINARY_API_SECRET is missing.");
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  console.log(
    isDryRun
      ? "\nDRY RUN - MongoDB will NOT be changed.\n"
      : "\nLIVE RUN - MongoDB WILL be updated.\n"
  );

  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 60000,
    connectTimeoutMS: 60000,
    socketTimeoutMS: 180000,
    heartbeatFrequencyMS: 10000,
    maxPoolSize: 2,
    minPoolSize: 0,
  });

  console.log("MongoDB connected:", mongoose.connection.name);

  // Only fetch IDs first. Do NOT fetch huge photos here.
  const propertyIds = await Property.find({})
    .select("_id")
    .lean()
    .maxTimeMS(120000)
    .exec();

  console.log(`Properties found: ${propertyIds.length}\n`);

  let propertiesWithImages = 0;
  let totalBase64Images = 0;

  for (const item of propertyIds) {
    // Fetch ONE property at a time including photos.
    const property = await Property.findById(item._id)
      .select("_id title location photos")
      .lean()
      .maxTimeMS(180000)
      .exec();

    if (!property) {
      console.log(`Skipping missing property: ${item._id}`);
      continue;
    }

    const photos = Array.isArray(property.photos)
      ? property.photos
      : [];

    const base64Photos = photos.filter(isBase64Image);

    const existingUrls = photos.filter(
      (photo) => !isBase64Image(photo)
    );

    if (base64Photos.length === 0) {
      console.log(
        `${property._id} | ${property.title || "Untitled"} | no Base64 photos`
      );
      continue;
    }

    propertiesWithImages += 1;
    totalBase64Images += base64Photos.length;

    console.log(
      `${property._id} | ${property.title || "Untitled"} | ` +
      `${property.location || "No location"} | ` +
      `${base64Photos.length} Base64 photo(s)`
    );

    if (isDryRun) {
      continue;
    }

    const uploadedUrls = [];

    for (let i = 0; i < base64Photos.length; i++) {
      console.log(
        `  Uploading image ${i + 1}/${base64Photos.length}...`
      );

      let result = null;

      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          console.log(
            `  Uploading ${i + 1}/${base64Photos.length} (attempt ${attempt}/3)...`
          );

          result = await cloudinary.uploader.upload(
            base64Photos[i],
            {
              folder: "takeonbnb/properties",
              resource_type: "image",
              timeout: 120000,
            }
          );

          break;
        } catch (uploadError) {
          console.error(
            `  Upload attempt ${attempt} failed:`,
            uploadError?.error?.message || uploadError?.message
          );

          if (attempt === 3) {
            throw uploadError;
          }

          await new Promise((resolve) => setTimeout(resolve, 2000 * attempt));
        }
      }

      uploadedUrls.push(result.secure_url);

      console.log(`  Uploaded successfully.`);
    }

    const newPhotos = [
      ...existingUrls,
      ...uploadedUrls,
    ];

    await Property.updateOne(
      { _id: property._id },
      {
        $set: {
          photos: newPhotos,
        },
      }
    ).exec();

    console.log(
      `  MongoDB updated: ${newPhotos.length} photo(s)\n`
    );
  }

  console.log("\n==============================");
  console.log("MIGRATION SUMMARY");
  console.log("==============================");
  console.log(
    "Properties with Base64 images:",
    propertiesWithImages
  );
  console.log(
    "Total Base64 images:",
    totalBase64Images
  );

  if (isDryRun) {
    console.log(
      "\nDry run complete. MongoDB was NOT changed."
    );
    console.log(
      "Run with --run to perform the actual migration."
    );
  } else {
    console.log(
      "\nCloudinary migration completed successfully."
    );
  }

  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error("\nMIGRATION ERROR:");
  console.error(error);

  try {
    await mongoose.disconnect();
  } catch (disconnectError) {
    console.error("MongoDB disconnect error:", disconnectError.message);
  }

  process.exit(1);
});




