import express from "express";

// Static amenities list (can be moved to DB later)
const AMENITIES = [
  { id: "wifi", name: "WiFi" },
  { id: "ac", name: "Air Conditioning" },
  { id: "pool", name: "Swimming Pool" },
  { id: "parking", name: "Free Parking" },
  { id: "kitchen", name: "Kitchen" },
  { id: "tv", name: "TV" },
  { id: "washing_machine", name: "Washing Machine" },
  { id: "gym", name: "Gym" },
  { id: "beach_access", name: "Beach Access" },
  { id: "bbq", name: "BBQ Grill" },
  { id: "hot_tub", name: "Hot Tub" },
  { id: "fireplace", name: "Fireplace" },
  { id: "pets_allowed", name: "Pets Allowed" },
  { id: "breakfast", name: "Breakfast Included" },
  { id: "balcony", name: "Balcony" },
  { id: "garden", name: "Garden" },
  { id: "security", name: "24/7 Security" },
  { id: "elevator", name: "Elevator" },
];

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    success: true,
    items: AMENITIES,
    total: AMENITIES.length,
  });
});

export default router;
