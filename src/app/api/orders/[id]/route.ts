import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyAdminToken } from "@/lib/auth"
import { cookies } from "next/headers"
import { z } from "zod"

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const order = await prisma.order.findFirst({ where: { OR: [{ id }, { tracking: id.toUpperCase() }] } })
    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json({ order: { ...order, items: JSON.parse(order.items as string) } })
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}

const statusSchema = z.object({
  status: z.enum(["pending", "shipped", "delivered", "cancelled"]),
})

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies()
  const token = cookieStore.get("z1_admin_token")?.value
  if (!token || !(await verifyAdminToken(token))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }
  const parsed = statusSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: "Invalid status" }, { status: 400 })

  try {
    const existing = await prisma.order.findFirst({ where: { OR: [{ id }, { tracking: id.toUpperCase() }] } })
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })
    const updated = await prisma.order.update({ where: { id: existing.id }, data: { status: parsed.data.status as never } })
    return NextResponse.json({ success: true, order: { ...updated, items: JSON.parse(updated.items as string) } })
  } catch (e) {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}