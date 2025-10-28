import Batch from "../models/Batch.js";

// ✅ Create Batch
export const createBatch = async (req, res) => {
  try {
    const { name, course, students, startDate, endDate } = req.body;
    const batch = await Batch.create({ name, course, students, startDate, endDate });
    res.status(201).json({ message: "Batch created", batch });
  } catch (error) {
    res.status(500).json({ message: "Failed to create batch", error });
  }
};

// ✅ Get All Batches
export const getBatches = async (req, res) => {
  try {
    const batches = await Batch.find()
      .populate("course", "name code")
      .populate("students", "name email");
    res.json(batches);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch batches", error });
  }
};

// ✅ Delete Batch
export const deleteBatch = async (req, res) => {
  try {
    await Batch.findByIdAndDelete(req.params.id);
    res.json({ message: "Batch deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete batch", error });
  }
};
