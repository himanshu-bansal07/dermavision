import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/lib/models/User";
import OtpModel from "@/lib/models/Otp";
import bcrypt from "bcryptjs";
import { inMemoryOtpStore, inMemoryUserStore } from "@/lib/mockDb";

export async function POST(request: Request) {
  try {
    const { email, name, password, age, gender, otp } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    if (!name || name.trim().length < 2) {
      return NextResponse.json({ error: "Please enter a valid name" }, { status: 400 });
    }

    if (!password || password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    if (!otp || otp.length !== 6) {
      return NextResponse.json({ error: "Invalid verification code" }, { status: 400 });
    }

    const emailLower = email.toLowerCase().trim();
    let otpValid = false;

    try {
      await connectToDatabase();

      // Verify OTP from database
      const otpRecord = await OtpModel.findOne({ email: emailLower, purpose: "register" });

      if (!otpRecord) {
        return NextResponse.json(
          { error: "Verification code has expired or was never sent. Please request a new one." },
          { status: 400 }
        );
      }

      if (otpRecord.otp !== otp) {
        return NextResponse.json({ error: "Incorrect verification code. Please try again." }, { status: 400 });
      }

      // OTP is valid — delete it immediately
      await OtpModel.deleteOne({ _id: otpRecord._id });
      otpValid = true;

      // Check again for duplicate email (race condition safety)
      const existingUser = await User.findOne({ email: emailLower });
      if (existingUser) {
        return NextResponse.json(
          { error: "Account already exists with this email." },
          { status: 400 }
        );
      }

      // Hash the password securely
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        email: emailLower,
        name: name.trim(),
        password: hashedPassword,
        age: age ? parseInt(age.toString()) : undefined,
        gender: gender || undefined,
      });

      await newUser.save();
      console.log("Successfully registered new user:", emailLower);

      return NextResponse.json({
        success: true,
        user: {
          email: newUser.email,
          name: newUser.name,
        },
      });

    } catch (dbErr: any) {
      console.warn("MongoDB connection warning in register confirm route:", dbErr.message);
      
      // Fallback to in-memory verification when database is down
      const storedOtp = inMemoryOtpStore.get(emailLower);
      
      if (!storedOtp || storedOtp.purpose !== "register") {
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

      // OTP is valid — delete it immediately
      inMemoryOtpStore.delete(emailLower);
      otpValid = true;

      // Check again for duplicate email (race condition safety)
      if (inMemoryUserStore.has(emailLower)) {
        return NextResponse.json(
          { error: "Account already exists with this email." },
          { status: 400 }
        );
      }

      // Hash the password securely for mock storage too
      const hashedPassword = await bcrypt.hash(password, 10);

      // Add to in-memory user store (for testing without MongoDB)
      inMemoryUserStore.set(emailLower, {
        email: emailLower,
        name: name.trim(),
        password: hashedPassword,
        age: age ? parseInt(age.toString()) : undefined,
        gender: gender || undefined,
      });
      console.log(`Successfully registered new user (in-memory): ${emailLower}`);

      return NextResponse.json({
        success: true,
        user: {
          email: emailLower,
          name: name.trim(),
        },
      });
    }

  } catch (error: any) {
    console.error("Registration confirmation failed:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create account" },
      { status: 500 }
    );
  }
}
