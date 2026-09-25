"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { useCartStore } from "@/store/cart"
import { useWishlist } from "@/store/wishlist"
import { IconSearch, IconHeart, IconCart, IconPhone, IconTruck } from "@/components/Icons"

function NavLink({ href, children, badge }: { href: string; children: React.ReactNode; badge?: string }) {
  const pathname = usePathname()
  const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href)
  return (
    <Link
      href={href}
      className={`px-4 py-2 rounded-full text-[13px] font-bold transition flex items-center gap-1.5 ${
        isActive
          ? "bg-[#1a1a1a] text-white shadow-sm"
          : "hover:bg-[#FDFBD4] border border-transparent hover:border-[#BDB76B]/30 text-[#1a1a1a]"
      }`}
    >
      {children}
      {badge && <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${isActive ? "bg-[#D4AF37] text-black" : "bg-[#CE8946] text-white"}`}>{badge}</span>}
      {isActive && <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37] hidden lg:block" />}
    </Link>
  )
}

export function Header() {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith("/admin")
  const { count } = useCartStore()
  const { count: wishCount } = useWishlist()
  const c = count()
  const w = wishCount
  const [mobileOpen, setMobileOpen] = useState(false)
  const [bump, setBump] = useState(false)
  useEffect(() => {
    if (c > 0) {
      setBump(true)
      const t = setTimeout(() => setBump(false), 400)
      return () => clearTimeout(t)
    }
  }, [c])

  // admin: compact
  if (isAdmin) {
    return (
      <header className="sticky top-0 z-50 bg-[#FFFEF7] border-b border-[#BDB76B]/20">
        <div className="mx-auto max-w-7xl px-4 h-[56px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/z1-logo.jpg" alt="Z1" className="h-9 w-9 rounded-xl border-2 border-[#D4AF37] object-cover" />
            <span className="font-black text-sm">Z1 NUTRITION</span>
          </Link>
          <span className="text-xs font-bold text-[#CE8946]">وضع الإدارة</span>
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-[#D4AF37] text-black text-xs font-bold overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 h-7 flex items-center justify-center gap-6 whitespace-nowrap">
          <span className="hidden sm:inline">توصيل مجاني للطلبات فوق 10000 دج</span>
          <span className="hidden sm:inline">•</span>
          <span>استخدم كود FIT10 لتوفير 10%</span>
          <span>•</span>
          <span className="hidden md:inline">منتجات أصلية 100% مضمونة</span>
        </div>
      </div>

      <div className="bg-[#1a1a1a] text-white text-xs">
        <div className="mx-auto max-w-7xl px-4 h-8 flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5">
            <IconPhone className="h-3.5 w-3.5 text-[#D4AF37]" />
            <span dir="ltr" className="font-bold tracking-wide">0775 12 34 56</span>
            <span className="bg-[#D4AF37] text-black px-2 py-0.5 rounded-full text-[10px] font-black hidden sm:inline">واتساب</span>
          </span>
          <span className="hidden md:flex items-center gap-1.5 text-white/70">
            <IconTruck className="h-3.5 w-3.5 text-[#D4AF37]" />
            التوصيل متوفر لـ 58 ولاية
          </span>
          <span className="text-white/60 hidden lg:inline text-[11px]">توصيل مجاني فوق 10000 دج • دفع عند الاستلام</span>
        </div>
      </div>

      <div className="bg-[#FFFEF7] border-b border-[#BDB76B]/20 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 h-[72px] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden h-10 w-10 rounded-full bg-white border border-[#BDB76B]/30 flex items-center justify-center"
              aria-label="menu"
              aria-expanded={mobileOpen}
            >
              <span className="flex flex-col gap-1">
                <span className={`h-0.5 w-4 bg-[#1a1a1a] block transition ${mobileOpen ? "rotate-45 translate-y-1.5" : ""}`} />
                <span className={`h-0.5 w-4 bg-[#1a1a1a] block ${mobileOpen ? "opacity-0" : ""}`} />
                <span className={`h-0.5 w-4 bg-[#1a1a1a] block transition ${mobileOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
              </span>
            </button>
            <Link href="/" className="flex items-center gap-3 shrink-0">
              <img src="/z1-logo.jpg" alt="Z1 Nutrition" className="h-12 w-12 rounded-xl object-cover border-2 border-[#D4AF37] shadow-sm" />
              <div className="leading-none hidden sm:block">
                <p className="font-black text-[16px] tracking-tight font-[var(--font-almarai)]">Z1 NUTRITION</p>
                <p className="text-[10px] tracking-[0.18em] text-[#CE8946] font-bold">SUPPLEMENTS STORE</p>
              </div>
            </Link>
          </div>

          <nav className="hidden lg:flex items-center gap-1">
            <NavLink href="/">الرئيسية</NavLink>
            <NavLink href="/products">المنتجات</NavLink>
            <NavLink href="/bundles" badge="جديد">العروض والـ Packs</NavLink>
            <NavLink href="/goals">الأهداف</NavLink>
            <NavLink href="/orders">طلباتي</NavLink>
            <NavLink href="/blog">المدونة</NavLink>
          </nav>

          <div className="flex items-center gap-1.5 shrink-0">
            <Link href="/products" className="h-10 w-10 rounded-full bg-white border border-[#BDB76B]/30 hidden sm:flex items-center justify-center hover:border-[#D4AF37]">
              <IconSearch className="h-4 w-4" />
            </Link>
            <Link href="/wishlist" className="h-10 w-10 rounded-full bg-white border border-[#BDB76B]/30 hidden sm:flex items-center justify-center hover:border-[#D4AF37] relative">
              <IconHeart className="h-4 w-4" />
              {w > 0 && <span className="absolute -top-1 -right-1 h-4 min-w-[16px] px-1 bg-[#CE8946] text-white text-[10px] font-black rounded-full flex items-center justify-center">{w}</span>}
            </Link>
            <Link href="/cart" className={`h-10 px-4 sm:px-5 rounded-full bg-[#D4AF37] text-black flex items-center gap-2 text-[13px] font-black hover:bg-[#BDB76B] transition relative ${bump ? "animate-bounce" : ""}`}>
              <IconCart className="h-4 w-4" />
              <span className="hidden sm:inline">السلة</span>
              <span className={`bg-black text-white text-xs px-1.5 py-0.5 rounded-full min-w-[20px] text-center transition ${bump ? "scale-125" : ""}`}>{c}</span>
            </Link>
          </div>
        </div>

        {mobileOpen && (
          <div className="lg:hidden border-t border-[#BDB76B]/15 bg-[#FFFEF7] px-4 py-4 space-y-3">
            <nav className="grid grid-cols-2 gap-2">
              <Link href="/" onClick={() => setMobileOpen(false)} className="bg-[#1a1a1a] text-white py-3 rounded-xl text-center text-sm font-black">الرئيسية</Link>
              <Link href="/products" onClick={() => setMobileOpen(false)} className="bg-white border border-[#BDB76B]/30 py-3 rounded-xl text-center text-sm font-bold">المنتجات</Link>
              <Link href="/bundles" onClick={() => setMobileOpen(false)} className="bg-[#D4AF37] text-black py-3 rounded-xl text-center text-sm font-black">العروض والـ Packs</Link>
              <Link href="/goals" onClick={() => setMobileOpen(false)} className="bg-white border border-[#BDB76B]/30 py-3 rounded-xl text-center text-sm font-bold">الأهداف</Link>
              <Link href="/orders" onClick={() => setMobileOpen(false)} className="bg-white border border-[#BDB76B]/30 py-3 rounded-xl text-center text-sm font-bold">طلباتي</Link>
              <Link href="/blog" onClick={() => setMobileOpen(false)} className="bg-white border border-[#BDB76B]/30 py-3 rounded-xl text-center text-sm font-bold">المدونة</Link>
            </nav>
            <div className="flex gap-2">
              <Link href="/products" onClick={() => setMobileOpen(false)} className="flex-1 flex items-center justify-center gap-2 bg-white border border-[#BDB76B]/30 py-2.5 rounded-full text-sm font-bold">
                <IconSearch className="h-4 w-4" /> بحث
              </Link>
              <Link href="/wishlist" onClick={() => setMobileOpen(false)} className="flex-1 flex items-center justify-center gap-2 bg-white border border-[#BDB76B]/30 py-2.5 rounded-full text-sm font-bold">
                <IconHeart className="h-4 w-4" /> المفضلة
              </Link>
            </div>
            <div className="bg-[#1a1a1a] text-white rounded-xl p-3 flex items-center justify-between text-xs">
              <span className="flex items-center gap-2"><IconPhone className="h-4 w-4 text-[#D4AF37]" /> <span dir="ltr">0775 12 34 56</span></span>
              <span className="bg-[#D4AF37] text-black px-2 py-1 rounded-full text-[10px] font-black">واتساب</span>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}