import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/lib/models/User";
import OtpModel from "@/lib/models/Otp";
import { sendRegisterOtp } from "@/lib/email";
import { inMemoryOtpStore, inMemoryUserStore } from "@/lib/mockDb";

export async function POST(request: Request) {
  try {
    const { email, name, age, gender } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    if (!name || name.trim().length < 2) {
      return NextResponse.json({ error: "Please enter a valid name" }, { status: 400 });
    }

    const isDev = process.env.NODE_ENV === "development";
    if (!process.env.RESEND_API_KEY && !isDev) {
      return NextResponse.json(
        { error: "Email service is not configured. Please contact the administrator." },
        { status: 503 }
      );
    }

    const emailLower = email.toLowerCase().trim();
    let finalOtp = "";

    try {
      // Check if user already exists
      await connectToDatabase();
      const existingUser = await User.findOne({ email: emailLower });
      if (existingUser) {
        return NextResponse.json(
          { error: "This email address is already registered. Please go to Login." },
          { status: 400 }
        );
      }

      // Generate 6-digit OTP
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      finalOtp = otpCode;

      // Store OTP in database (replaces any existing OTP for this email+purpose)
      await OtpModel.deleteMany({ email: emailLower, purpose: "register" });
      await OtpModel.create({ email: emailLower, otp: otpCode, purpose: "register" });

      // Send email via Resend if key is available
      if (process.env.RESEND_API_KEY) {
        await sendRegisterOtp(emailLower, name.trim(), otpCode);
      } else {
        console.warn(`[DEV MODE] Skipping Resend delivery (no key). Simulated registration OTP for ${emailLower}: ${otpCode}`);
      }

    } catch (dbErr: any) {
      console.warn("MongoDB connection warning in register route:", dbErr.message);
      
      // Fallback to in-memory storage when database is down
      if (inMemoryUserStore.has(emailLower)) {
        return NextResponse.json(
          { error: "This email address is already registered. Please go to Login." },
          { status: 400 }
        );
      }

      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      finalOtp = otpCode;
      inMemoryOtpStore.set(emailLower, {
        otp: otpCode,
        expiresAt: Date.now() + 60000, // 60 seconds
        purpose: "register"
      });
      console.log(`Registration OTP stored in-memory for ${emailLower}: ${otpCode}`);

      // Send email via Resend if key is available
      if (process.env.RESEND_API_KEY) {
        await sendRegisterOtp(emailLower, name.trim(), otpCode);
      } else {
        console.warn(`[DEV MODE] Skipping Resend delivery (no key). Simulated registration OTP for ${emailLower}: ${otpCode}`);
      }
    }

    return NextResponse.json({ 
      success: true,
      ...(isDev ? { devOtp: finalOtp } : {})
    });

  } catch (error: any) {
    console.error("Registration OTP generation failed:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send registration email" },
      { status: 500 }
    );
  }
}
