import Announcement from "../models/Announcement.js";

// ✅ Create new announcement
export const createAnnouncement = async (req, res) => {
  try {
    const { title, message, targetRoles } = req.body;
    if (!title || !message || !targetRoles.length)
      return res.status(400).json({ message: "Missing required fields" });

    const newAnnouncement = await Announcement.create({
      title,
      message,
      targetRoles,
      createdBy: req.user.id,
    });

    res.status(201).json({ message: "Announcement created", data: newAnnouncement });
  } catch (error) {
    console.error("Create Announcement Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Get all announcements
export const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch announcements" });
  }
};

// ✅ Delete announcement
export const deleteAnnouncement = async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ message: "Announcement deleted" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed", error });
  }
};
