"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [authed, setAuthed] = useState<boolean | null>(null)

  useEffect(() => {
    let cancelled = false
    async function check() {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" })
        const ok = res.ok
        if (!cancelled) {
          setAuthed(ok)
          if (!ok) router.replace("/admin/login")
        }
      } catch {
        if (!cancelled) {
          setAuthed(false)
          router.replace("/admin/login")
        }
      }
    }
    check()
    return () => { cancelled = true }
  }, [pathname, router])

  if (authed === null) {
    return <div className="mx-auto max-w-7xl px-4 py-12 text-center text-sm">جاري التحقق...</div>
  }

  if (!authed) {
    return <div className="mx-auto max-w-7xl px-4 py-12 text-center text-sm">يجب تسجيل الدخول</div>
  }

  const isActive = (href: string) => pathname === href

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="bg-[#1a1a1a] text-white rounded-2xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/z1-logo.jpg" alt="Z1" className="h-10 w-10 rounded-xl border-2 border-[#D4AF37] object-cover" />
          <div>
            <p className="font-black">لوحة تحكم Z1 Nutrition</p>
            <p className="text-xs text-white/60">إدارة المنتجات والطلبات والبروموهات</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" })
              router.push("/admin/login")
              router.refresh()
            }}
            className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded-full text-xs font-bold"
          >
            خروج
          </button>
          <Link href="/" className="bg-white text-black px-4 py-2 rounded-full text-xs font-black">المتجر</Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-[220px_1fr] gap-6 mt-6">
        <aside className="bg-white border border-[#BDB76B]/20 rounded-2xl p-3 h-fit sticky top-24">
          <nav className="space-y-1 text-sm font-bold">
            <Link href="/admin" className={`block px-4 py-2.5 rounded-xl ${isActive("/admin") ? "bg-[#1a1a1a] text-white" : "hover:bg-[#FDFBD4]"}`}>نظرة عامة</Link>
            <Link href="/admin/products" className={`block px-4 py-2.5 rounded-xl ${isActive("/admin/products") ? "bg-[#1a1a1a] text-white" : "hover:bg-[#FDFBD4]"}`}>المنتجات</Link>
            <Link href="/admin/orders" className={`block px-4 py-2.5 rounded-xl ${isActive("/admin/orders") ? "bg-[#1a1a1a] text-white" : "hover:bg-[#FDFBD4]"}`}>الطلبات</Link>
            <Link href="/admin/promos" className={`block px-4 py-2.5 rounded-xl flex items-center gap-2 ${isActive("/admin/promos") ? "bg-[#1a1a1a] text-white" : "hover:bg-[#FDFBD4]"}`}>أكواد البرومو <span className="bg-[#D4AF37] text-black text-[10px] px-1.5 py-0.5 rounded-full">FIT10</span></Link>
          </nav>
        </aside>
        <div className="bg-[#FFFEF7] border border-[#BDB76B]/10 rounded-2xl p-6 min-h-[500px]">{children}</div>
      </div>
    </div>
  )
}
