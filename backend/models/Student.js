import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    batch: { type: String },
    guardianName: { type: String },
    contact: { type: String },
    marks: [
      {
        subject: String,
        score: Number,
      },
    ],
    role: { type: String, default: "student" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);
