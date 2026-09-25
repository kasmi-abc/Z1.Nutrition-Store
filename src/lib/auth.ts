import * as jose from "jose"
import bcrypt from "bcryptjs"

const SECRET = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "change-me-32chars"
const secretKey = new TextEncoder().encode(SECRET)
const ALG = "HS256"
const COOKIE_NAME = "z1_admin_token"
const MAX_AGE = 12 * 60 * 60 // 12h

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10)
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash)
}

export async function signAdminToken(payload: { username: string }) {
  return await new jose.SignJWT({ username: payload.username, role: "admin" })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secretKey)
}

export async function verifyAdminToken(token: string): Promise<{ username: string } | null> {
  try {
    const { payload } = await jose.jwtVerify(token, secretKey)
    if (payload.role !== "admin" || typeof payload.username !== "string") return null
    return { username: payload.username as string }
  } catch {
    return null
  }
}

export function getAuthCookieName() {
  return COOKIE_NAME
}

export function getAuthCookieMaxAge() {
  return MAX_AGE
}

export function isValidUsername(u: string): boolean {
  return /^[a-zA-Z0-9_]{3,32}$/.test(u)
}