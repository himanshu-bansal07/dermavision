// Shared in-memory database for when MongoDB is offline
export const inMemoryOtpStore = new Map<string, { otp: string; expiresAt: number; purpose: string }>();

// Store user objects (email, name, password hash, etc.)
export const inMemoryUserStore = new Map<string, any>();
