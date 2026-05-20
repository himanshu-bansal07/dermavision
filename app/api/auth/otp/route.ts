import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import OtpModel from "@/lib/models/Otp";
import User from "@/lib/models/User";
import { sendLoginOtp } from "@/lib/email";
import { inMemoryOtpStore, inMemoryUserStore } from "@/lib/mockDb";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const isDev = process.env.NODE_ENV === "development";
    if (!process.env.RESEND_API_KEY && !isDev) {
      return NextResponse.json(
        { error: "Email service is not configured. Please contact the administrator." },
        { status: 503 }
      );
    }

    const emailLower = email.toLowerCase().trim();

    let dbOnline = true;
    try {
      // Verify user exists
      await connectToDatabase();
      const existingUser = await User.findOne({ email: emailLower });
      if (!existingUser) {
        return NextResponse.json({ error: "Email not registered. Please sign up first." }, { status: 404 });
      }
    } catch (dbErr: any) {
      console.warn("MongoDB offline, falling back to mock user store.");
      dbOnline = false;
      if (!inMemoryUserStore.has(emailLower)) {
        return NextResponse.json({ error: "Email not registered. Please sign up first." }, { status: 404 });
      }
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    try {
      if (dbOnline) {
        // Store OTP in database (replaces any existing OTP for this email)
        await OtpModel.deleteMany({ email: emailLower, purpose: "login" });
        await OtpModel.create({ email: emailLower, otp: otpCode, purpose: "login" });
      } else {
        throw new Error("DB offline");
      }
    } catch (dbErr: any) {
      console.warn("MongoDB connection warning in OTP route, storing in-memory.");
      // Fallback to in-memory storage when database is down
      inMemoryOtpStore.set(emailLower, {
        otp: otpCode,
        expiresAt: Date.now() + 60000, // 60 seconds
        purpose: "login"
      });
      console.log(`OTP stored in-memory for ${emailLower}: ${otpCode}`);
    }

    // Send email via Resend if key is available
    if (process.env.RESEND_API_KEY) {
      await sendLoginOtp(emailLower, otpCode);
    } else {
      console.warn(`[DEV MODE] Skipping Resend delivery (no key). Simulated login OTP for ${emailLower}: ${otpCode}`);
    }

    return NextResponse.json({ 
      success: true,
      ...(isDev ? { devOtp: otpCode } : {})
    });

  } catch (error: any) {
    console.error("OTP send failed:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send verification code" },
      { status: 500 }
    );
  }
}
