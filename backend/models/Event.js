import mongoose from "mongoose";
import crypto from 'crypto';
const eventSchema = new mongoose.Schema(
  {
    eventType: { type: String, required: true, trim: true },
    eventName: { type: String, required: true, trim: true },
    institute: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    startDate: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    endDate: { type: Date, required: true },
    opportunity: { type: Number, required: true, min: 1 },
    minAge: { type: Number, required: true, min: 18 },
    maxAge: { type: Number, required: true, min: 18 },
    description: { type: String, required: true, trim: true },
    qualification: { type: String, required: true, trim: true },
    qualificationType: { type: String, required: function() {return this.qualification === "Required"}, trim: true },
    minDay: { type: Number, required: true, min: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "inactive"],
      default: "pending",
    },
    attendanceToken: {type: String, unique: true},
  },
  { timestamps: true }
);

// Generate unique token before save
eventSchema.pre("save", function (next) {
  if (!this.attendanceToken) {
    this.attendanceToken = crypto.randomBytes(16).toString("hex");
  }
  next();
});

export default mongoose.model("Event", eventSchema);
