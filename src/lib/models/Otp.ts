import mongoose, { Schema, Document } from "mongoose";

export interface IOtp extends Document {
  email: string;
  otp: string;
  purpose: "login" | "register";
  createdAt: Date;
}

const OtpSchema = new Schema<IOtp>({
  email: { type: String, required: true, lowercase: true, trim: true },
  otp: { type: String, required: true },
  purpose: { type: String, enum: ["login", "register"], default: "login" },
  createdAt: { type: Date, default: Date.now, expires: 60 }, // auto-delete after 60 seconds
});

// Compound index for fast lookup and cleanup
OtpSchema.index({ email: 1, purpose: 1 });

export default mongoose.models.Otp || mongoose.model<IOtp>("Otp", OtpSchema);
