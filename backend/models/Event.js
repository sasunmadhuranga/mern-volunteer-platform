import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    eventType: { type: String, required: true, trim: true },
    eventName: { type: String, required: true, trim: true },
    institute: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    opportunity: { type: Number, required: true, min: 1 },
    minAge: { type: Number, required: true, min: 18 },
    maxAge: { type: Number, required: true, min: 18 },
    description: { type: String, required: true, trim: true },
    qualification: { type: String, required: true, trim: true },
    minDay: { type: Number, required: true, min: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "inactive"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);
