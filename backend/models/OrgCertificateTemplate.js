import mongoose from "mongoose";

const orgTemplateSchema = new mongoose.Schema({
  orgId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  templateId: { type: mongoose.Schema.Types.ObjectId, ref: "CertificateTemplate", required: true },
  signature: { type: String }, // file path
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model("OrgCertificateTemplate", orgTemplateSchema);
