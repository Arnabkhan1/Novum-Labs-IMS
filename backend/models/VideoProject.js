import mongoose from "mongoose";

const videoProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    client: { type: String },
    shootDate: { type: Date },
    assignedEditor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: ["planning", "shooting", "editing", "completed"],
      default: "planning",
    },
    thumbnailUrl: { type: String },
    videoUrl: { type: String },
    progress: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("VideoProject", videoProjectSchema);
