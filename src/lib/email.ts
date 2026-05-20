import { Resend } from "resend";
import nodemailer from "nodemailer";

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "DermaVision AI <onboarding@resend.dev>";

// Gmail SMTP transporter — sends to ANY email address (set SMTP_USER + SMTP_PASS in .env.local)
const transporter = process.env.SMTP_USER && process.env.SMTP_PASS
  ? nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS, // Use a Gmail App Password, NOT your real password
      },
    })
  : null;

// Resend client (fallback)
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

if (!transporter && !resend) {
  console.error("[EMAIL CONFIG] No SMTP_USER/SMTP_PASS or RESEND_API_KEY configured. OTPs will only appear in server logs.");
}

function otpEmailHtml(otpCode: string, heading: string, subtext: string) {
  return `
    <div style="font-family: sans-serif; max-width: 500px; margin: auto; padding: 25px; border: 1px solid #eaeaea; border-radius: 16px; background-color: #ffffff; color: #333333; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #00F2FE; margin: 0; font-size: 24px; font-weight: 800;">DermaVision <span style="color: #9b51e0;">AI</span></h2>
        <p style="font-size: 12px; color: #888888; margin: 5px 0 0 0;">${subtext}</p>
      </div>
      <div style="background-color: #f6f8fa; border-radius: 12px; padding: 20px; text-align: center; border: 1px solid #eaeaea;">
        <p style="font-size: 14px; margin-top: 0; color: #555555;">${heading}</p>
        <div style="font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #9b51e0; margin: 15px 0; font-family: monospace;">
          ${otpCode}
        </div>
        <p style="font-size: 11px; color: #888888; margin-bottom: 0;">Valid for 60 seconds. Do not share this code.</p>
      </div>
      <p style="font-size: 12px; color: #666666; line-height: 1.5; margin-top: 20px;">
        If you did not request this code, you can safely ignore this email.
      </p>
      <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 20px 0;" />
      <p style="font-size: 10px; color: #aaaaaa; text-align: center; margin: 0;">
        &copy; 2026 DermaVision AI &mdash; Secure Healthcare Platform
      </p>
    </div>
  `;
}

async function sendEmail(to: string, subject: string, html: string) {
  // 1. Try Gmail SMTP first (works for any recipient)
  if (transporter) {
    await transporter.sendMail({
      from: `"DermaVision AI" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`[EMAIL] Sent via Gmail SMTP to ${to}`);
    return;
  }

  // 2. Try Resend (only works for verified domain OR owner's own email in free tier)
  if (resend) {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject,
      html,
    });
    if (error) {
      // Resend free tier restricts to owner's own email — treat as soft failure in dev
      console.warn(`[EMAIL] Resend failed for ${to}: ${error.message}`);
      if (process.env.NODE_ENV === "development") return; // don't throw in dev
      throw new Error(`Email delivery failed: ${error.message}`);
    }
    console.log(`[EMAIL] Sent via Resend to ${to}`);
    return;
  }

  // 3. No provider configured — log only (dev mode)
  if (process.env.NODE_ENV === "development") {
    console.warn(`[EMAIL - NO PROVIDER] Email not sent. Subject: "${subject}" → ${to}`);
    return;
  }

  throw new Error("No email provider configured. Set SMTP_USER+SMTP_PASS or RESEND_API_KEY in .env.local");
}

export async function sendLoginOtp(email: string, otpCode: string) {
  console.log(`[OTP] Login OTP for ${email}: ${otpCode}`);
  await sendEmail(
    email,
    "Your DermaVision Login Code",
    otpEmailHtml(otpCode, "Your 6-digit login verification code is:", "Medical-Grade Skincare Platform")
  );
}

export async function sendRegisterOtp(email: string, name: string, otpCode: string) {
  console.log(`[OTP] Registration OTP for ${email}: ${otpCode}`);
  await sendEmail(
    email,
    "Verify Your New DermaVision Account",
    otpEmailHtml(otpCode, `Hello <strong>${name}</strong>, your registration passcode is:`, "Create Your Account")
  );
}
