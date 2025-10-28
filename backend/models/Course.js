import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    description: { type: String },
    duration: { type: String }, // e.g. "6 Months"
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // assigned teacher
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);
