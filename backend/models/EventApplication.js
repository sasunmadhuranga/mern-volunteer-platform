import mongoose from "mongoose";
const eventApplicationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    contactEmail: { type: String, required: true },
    phone: { type: String },
    qualificationFile: { type: String }, // store file path
    appliedAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("EventApplication", eventApplicationSchema);
