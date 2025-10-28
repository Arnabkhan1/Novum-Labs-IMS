import mongoose from "mongoose";

const socialPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    platform: { type: String, enum: ["Instagram", "Facebook", "YouTube", "LinkedIn"], default: "Instagram" },
    status: { type: String, enum: ["Draft", "Scheduled", "Published"], default: "Draft" },
    scheduledTime: { type: Date },
    content: { type: String },
    hashtags: [String],
    analytics: {
      reach: { type: Number, default: 0 },
      engagement: { type: Number, default: 0 },
      growth: { type: String, default: "+0%" },
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("SocialPost", socialPostSchema);
