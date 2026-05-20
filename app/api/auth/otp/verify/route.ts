import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/lib/models/User";
import OtpModel from "@/lib/models/Otp";
import { inMemoryOtpStore, inMemoryUserStore } from "@/lib/mockDb";

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    if (!otp || otp.length !== 6) {
      return NextResponse.json({ error: "Invalid verification code" }, { status: 400 });
    }

    const emailLower = email.toLowerCase().trim();
    let otpValid = false;
    let user = null;

    try {
      await connectToDatabase();

      // Verify OTP from database
      const otpRecord = await OtpModel.findOne({ email: emailLower, purpose: "login" });

      if (!otpRecord) {
        return NextResponse.json(
          { error: "Verification code has expired or was never sent. Please request a new one." },
          { status: 400 }
        );
      }

      if (otpRecord.otp !== otp) {
        return NextResponse.json({ error: "Incorrect verification code. Please try again." }, { status: 400 });
      }

      // OTP is valid — delete it immediately (one-time use)
      await OtpModel.deleteOne({ _id: otpRecord._id });
      otpValid = true;

      // Find user (if they exist — for login they must already be registered)
      user = await User.findOne({ email: emailLower });

    } catch (dbErr: any) {
      console.warn("MongoDB connection warning in OTP verify route:", dbErr.message);
      // Fallback to in-memory verification when database is down
      const storedOtp = inMemoryOtpStore.get(emailLower);
      
      if (!storedOtp) {
        return NextResponse.json(
          { error: "Verification code has expired or was never sent. Please request a new one." },
          { status: 400 }
        );
      }

      if (Date.now() > storedOtp.expiresAt) {
        inMemoryOtpStore.delete(emailLower);
        return NextResponse.json(
          { error: "Verification code has expired. Please request a new one." },
          { status: 400 }
        );
      }

      if (storedOtp.otp !== otp) {
        return NextResponse.json({ error: "Incorrect verification code. Please try again." }, { status: 400 });
      }

      // OTP is valid — delete it immediately (one-time use)
      inMemoryOtpStore.delete(emailLower);
      otpValid = true;
      user = inMemoryUserStore.get(emailLower);
      console.log(`OTP verified from in-memory store for ${emailLower}`);
    }

    return NextResponse.json({
      success: true,
      user: {
        email: emailLower,
        name: user?.name || "Patient",
      },
    });

  } catch (error: any) {
    console.error("OTP verification failed:", error);
    return NextResponse.json(
      { error: error.message || "Failed to verify code" },
      { status: 500 }
    );
  }
}
