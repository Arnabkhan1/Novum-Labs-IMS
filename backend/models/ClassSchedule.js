import mongoose from "mongoose";

const classScheduleSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true },
    teacher: { type: String, required: true },
    classRoom: { type: String, required: true },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    coordinator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("ClassSchedule", classScheduleSchema);
