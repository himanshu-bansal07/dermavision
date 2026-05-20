import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";
import { inMemoryUserStore } from "@/lib/mockDb";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    if (!password || password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const emailLower = email.toLowerCase().trim();

    try {
      await connectToDatabase();
      
      const user = await User.findOne({ email: emailLower });

      if (!user) {
        return NextResponse.json(
          { error: "Invalid email or password." },
          { status: 400 }
        );
      }

      if (!user.password) {
        return NextResponse.json(
          { error: "No password set for this account. Please sign in via Google or OTP." },
          { status: 400 }
        );
      }

      // Verify the password using bcrypt
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return NextResponse.json(
          { error: "Invalid email or password." },
          { status: 400 }
        );
      }

      // Success
      return NextResponse.json({
        success: true,
        user: {
          email: user.email,
          name: user.name || "Patient",
        }
      });

    } catch (dbErr: any) {
      console.warn("MongoDB connection warning in login route:", dbErr.message);
      
      // Fallback to in-memory check
      const mockUser = inMemoryUserStore.get(emailLower);
      if (!mockUser) {
        return NextResponse.json({ error: "account not founded" }, { status: 404 });
      }

      if (!mockUser.password) {
        return NextResponse.json({ error: "No password set for this account." }, { status: 400 });
      }

      const passwordMatch = await bcrypt.compare(password, mockUser.password);
      if (!passwordMatch) {
        return NextResponse.json({ error: "Invalid email or password." }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        user: {
          email: mockUser.email,
          name: mockUser.name || "Patient",
        }
      });
    }

  } catch (error: any) {
    console.error("Login verification failed:", error);
    return NextResponse.json({ error: error.message || "Failed to log in" }, { status: 500 });
  }
}
