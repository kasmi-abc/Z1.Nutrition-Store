import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyAdminToken } from "@/lib/auth"
import { cookies } from "next/headers"
import { z } from "zod"

export async function DELETE(_req: Request, { params }: { params: Promise<{ code: string }> }) {
  const cookieStore = await cookies()
  const token = cookieStore.get("z1_admin_token")?.value
  if (!token || !(await verifyAdminToken(token))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { code } = await params
  try {
    await prisma.promo.delete({ where: { code: code.toUpperCase() } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
}

const patchSchema = z.object({
  active: z.boolean().optional(),
  discount: z.number().int().min(1).max(90).optional(),
  expiry: z.string().optional(),
})

export async function PATCH(req: Request, { params }: { params: Promise<{ code: string }> }) {
  const cookieStore = await cookies()
  const token = cookieStore.get("z1_admin_token")?.value
  if (!token || !(await verifyAdminToken(token))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { code } = await params
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }
  const parsed = patchSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 })

  try {
    const data: Record<string, unknown> = {}
    if (parsed.data.active !== undefined) data["active"] = parsed.data.active
    if (parsed.data.discount !== undefined) data["discount"] = parsed.data.discount
    if (parsed.data.expiry) data["expiry"] = new Date(parsed.data.expiry)
    const promo = await prisma.promo.update({ where: { code: code.toUpperCase() }, data: data as never })
    return NextResponse.json({ success: true, promo })
  } catch {
    return NextResponse.json({ error: "Not found or failed" }, { status: 404 })
  }
}