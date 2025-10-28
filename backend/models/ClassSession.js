import mongoose from "mongoose";

const classSessionSchema = new mongoose.Schema(
  {
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    batch: { type: mongoose.Schema.Types.ObjectId, ref: "Batch" },
    topic: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String },
    duration: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("ClassSession", classSessionSchema);
