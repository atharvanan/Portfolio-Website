import crypto from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "portfolio_admin_token";
const SECRET = process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || "atharva-portfolio-admin-secret-key-2026";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

/**
 * Sign a token using HMAC SHA256.
 */
export function createSessionToken(): string {
  const payload = JSON.stringify({
    role: "admin",
    timestamp: Date.now(),
  });
  const b64Payload = Buffer.from(payload).toString("base64url");
  const signature = crypto
    .createHmac("sha256", SECRET)
    .update(b64Payload)
    .digest("base64url");

  return `${b64Payload}.${signature}`;
}

/**
 * Verify session token.
 */
export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [b64Payload, signature] = parts;
  const expectedSignature = crypto
    .createHmac("sha256", SECRET)
    .update(b64Payload)
    .digest("base64url");

  if (signature !== expectedSignature) return false;

  try {
    const payload = JSON.parse(Buffer.from(b64Payload, "base64url").toString());
    // Valid for 7 days
    const maxAgeMs = 7 * 24 * 60 * 60 * 1000;
    if (Date.now() - payload.timestamp > maxAgeMs) {
      return false;
    }
    return payload.role === "admin";
  } catch {
    return false;
  }
}

/**
 * Check if the current request is authenticated as Admin.
 */
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

/**
 * Verify given password against ADMIN_PASSWORD.
 */
export function verifyPassword(password: string): boolean {
  if (!password) return false;
  return password === ADMIN_PASSWORD;
}

export { COOKIE_NAME };

