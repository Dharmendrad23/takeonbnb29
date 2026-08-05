import User from "../models/User.js";

// GET /users?ids=id1,id2,id3 -- batch lookup used by admin UI to show host names
export const getUsersByIds = async (req, res) => {
  try {
    const idsParam = req.query.ids;

    if (!idsParam) {
      return res.json([]);
    }

    const ids = String(idsParam)
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);

    const users = await User.find({ _id: { $in: ids } }).select("name email role");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /users/:id
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("name email role");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
