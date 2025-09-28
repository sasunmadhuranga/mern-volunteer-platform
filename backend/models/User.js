import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['VOLUNTEER', 'ORG_ADMIN', 'ADMIN'], default: 'VOLUNTEER' },
  profilePic: { type: String, default: "" },
  contactEmail: { type: String, default: "" },
  phone: { type: String, default: "" },
  aboutInfo: {type: String, default: ""},
  birthday: {type: Date, default: null},
  gender: {type: String, default: ""},
  address: {type: String, default: ""},
  city: {type: String, default: ""},
}, { timestamps: true });

export default mongoose.model('User', userSchema);
