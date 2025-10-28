import mongoose from "mongoose";

const batchSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    startDate: { type: String },
    endDate: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Batch", batchSchema);
