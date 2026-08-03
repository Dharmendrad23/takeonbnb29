import Wishlist from "../models/Wishlist.js";

// GET wishlist items
export const getWishlist = async (req, res) => {
  try {
    const filter = {};
    if (req.query.guestId) filter.guestId = req.query.guestId;
    else if (req.user?.id) filter.guestId = req.user.id;

    const items = await Wishlist.find(filter).populate("propertyId");

    res.json({
      success: true,
      items,
      total: items.length,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST add to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { propertyId, guestId } = req.body;
    const guestIdResolved = guestId || req.user?.id;

    if (!guestIdResolved || !propertyId) {
      return res
        .status(400)
        .json({ success: false, message: "guestId and propertyId are required" });
    }

    const item = await Wishlist.findOneAndUpdate(
      { guestId: guestIdResolved, propertyId },
      { guestId: guestIdResolved, propertyId },
      { upsert: true, new: true }
    );

    res.status(201).json({ success: true, item });
  } catch (err) {
    // Ignore duplicate key errors
    if (err.code === 11000) {
      const existing = await Wishlist.findOne({
        guestId: req.body.guestId || req.user?.id,
        propertyId: req.body.propertyId,
      });
      return res.status(200).json({ success: true, item: existing });
    }
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE remove from wishlist by id
export const removeFromWishlist = async (req, res) => {
  try {
    const item = await Wishlist.findByIdAndDelete(req.params.id);
    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "Wishlist item not found" });
    res.json({ success: true, message: "Removed from wishlist" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE remove by guestId + propertyId
export const removeFromWishlistByProperty = async (req, res) => {
  try {
    const { guestId, propertyId } = req.query;
    await Wishlist.deleteOne({ guestId, propertyId });
    res.json({ success: true, message: "Removed from wishlist" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
