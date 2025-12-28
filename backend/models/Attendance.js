import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    volunteerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    eventApplicationId: { type: mongoose.Schema.Types.ObjectId, ref: "EventApplication", required: true },

    date: { type: String, required: true }, // YYYY-MM-DD
    checkInTime: { type: Date },
    checkOutTime: { type: Date },

  },
  { timestamps: true }
);


export default mongoose.model("Attendance", attendanceSchema);
