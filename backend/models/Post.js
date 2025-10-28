import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    caption: { type: String, required: true },
    hashtags: [{ type: String }],
    mediaUrl: { type: String },
    scheduledAt: { type: Date, required: true },
    status: { type: String, enum: ["scheduled", "published"], default: "scheduled" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);
