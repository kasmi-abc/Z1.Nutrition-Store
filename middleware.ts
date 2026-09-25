import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyJwt } from "@/lib/jwt-edge"

const COOKIE_NAME = "z1_admin_token"

function getSecret() {
  return process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "change-me-32chars"
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const res = NextResponse.next()

  // Security headers for admin
  if (pathname.startsWith("/admin")) {
    res.headers.set("X-Robots-Tag", "noindex, nofollow")
    res.headers.set("Cache-Control", "no-store")
  }

  // Protect /admin except /admin/login
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = req.cookies.get(COOKIE_NAME)?.value
    if (!token) {
      const url = req.nextUrl.clone()
      url.pathname = "/admin/login"
      return NextResponse.redirect(url)
    }
    try {
      const payload = await verifyJwt(token, getSecret())
      if (!payload || payload.role !== "admin") throw new Error("not admin")
    } catch {
      const url = req.nextUrl.clone()
      url.pathname = "/admin/login"
      const redirectRes = NextResponse.redirect(url)
      // clear invalid cookie
      redirectRes.cookies.set(COOKIE_NAME, "", { maxAge: 0, path: "/" })
      return redirectRes
    }
  }

  // Protect API admin endpoints
  if (pathname.startsWith("/api/admin") || pathname.startsWith("/api/products") && req.method !== "GET" || pathname.startsWith("/api/promos") && req.method !== "GET" || pathname.startsWith("/api/orders") && req.method === "GET" && req.nextUrl.searchParams.has("admin")) {
    // For write operations, check admin token (allow GET public)
    const isWrite = req.method !== "GET"
    const isAdminRead = pathname.startsWith("/api/orders") && req.nextUrl.searchParams.get("admin") === "1"
    if (isWrite || isAdminRead) {
      const token = req.cookies.get(COOKIE_NAME)?.value
      if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
      try {
        const payload = await verifyJwt(token, getSecret())
        if (!payload || payload.role !== "admin") throw new Error("not admin")
      } catch {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 })
      }
    }
  }

  return res
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
}