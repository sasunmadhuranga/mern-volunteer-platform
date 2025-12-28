import mongoose from "mongoose";
import crypto from "crypto";

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
    qualificationType: {
      type: String,
      required: function () {
        return this.qualification === "Required";
      },
      trim: true,
    },

    minDay: { type: Number, required: true, min: 0 },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "inactive"],
      default: "pending",
    },

    // DAILY QR TOKENS
    dailyTokens: {
      type: Map,
      of: String,
      default: {},
    },
  },
  { timestamps: true }
);

// Generate daily tokens when event is created OR when dates change
eventSchema.pre("validate", function (next) {
  const startChanged = this.isModified("startDate");
  const endChanged = this.isModified("endDate");

  // If tokens already exist AND dates did not change → skip
  if (!startChanged && !endChanged && this.dailyTokens && Object.keys(this.dailyTokens).length > 0) {
    return next();
  }

  const dayTokens = {};
  let current = new Date(this.startDate);
  const end = new Date(this.endDate);

  while (current <= end) {
    const dateKey = current.toISOString().split("T")[0];
    dayTokens[dateKey] = crypto.randomBytes(16).toString("hex");
    current.setDate(current.getDate() + 1);
  }

  this.dailyTokens = dayTokens;
  next();
});

export default mongoose.model("Event", eventSchema);
