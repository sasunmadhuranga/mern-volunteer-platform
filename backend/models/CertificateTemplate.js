import mongoose from "mongoose";

const certificateTemplateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    htmlTemplate: {
      type: String,
      required: true,
    },

    placeholders: [
      {
        type: String, // e.g. {{volunteerName}}
      },
    ],

    previewImage: {
      type: String,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("CertificateTemplate", certificateTemplateSchema);
