import mongoose from "mongoose";

const homeworkSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    batch: { type: mongoose.Schema.Types.ObjectId, ref: "Batch" },
    dueDate: { type: String },
    attachments: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model("Homework", homeworkSchema);
