import User from "../models/User.js";

// ✅ Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users", error });
  }
};

// ✅ Update user role
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const updated = await User.findByIdAndUpdate(id, { role }, { new: true });
    res.json({ message: "Role updated successfully", updated });
  } catch (error) {
    res.status(500).json({ message: "Failed to update role", error });
  }
};

// ✅ Deactivate user
export const deactivateUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndUpdate(id, { status: "inactive" });
    res.json({ message: "User deactivated" });
  } catch (error) {
    res.status(500).json({ message: "Failed to deactivate user", error });
  }
};
