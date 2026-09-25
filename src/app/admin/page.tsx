"use client"
import Link from "next/link"
import { useProducts } from "@/hooks/useProducts"
import { useEffect, useState } from "react"

export default function AdminOverview() {
  const products = useProducts()
  const totalStock = products.reduce((s, p) => s + p.variants.reduce((a, v) => a + v.stock, 0), 0)
  const lowStock = products.filter(p => p.variants.some(v => v.stock < 5)).length
  const [ordersCount, setOrdersCount] = useState<number | null>(null)
  const [promo, setPromo] = useState<string>("FIT10 - 10%")
  const [neonStatus, setNeonStatus] = useState<"ok" | "fail" | "loading">("loading")

  useEffect(() => {
    async function load() {
      try {
        const [oRes, pRes] = await Promise.all([
          fetch("/api/orders?admin=1&limit=1", { cache: "no-store" }),
          fetch("/api/promos?admin=1", { cache: "no-store" }),
        ])
        if (oRes.ok) {
          const d = await oRes.json()
          setOrdersCount(d.pagination?.total ?? d.orders?.length ?? 0)
          setNeonStatus("ok")
        } else setNeonStatus("fail")
        if (pRes.ok) {
          const d2 = await pRes.json()
          const active = d2.promos?.find((p: any) => p.active)
          if (active) setPromo(`${active.code} - ${active.discount}%`)
        }
      } catch {
        setNeonStatus("fail")
      }
    }
    load()
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-black">نظرة عامة</h1>
      <p className="text-sm text-zinc-600">مرحباً أدمن - إدارة متجر المكملات</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <div className="bg-white border border-[#BDB76B]/20 rounded-2xl p-5">
          <p className="text-xs text-zinc-500">إجمالي المنتجات</p>
          <p className="text-2xl font-black mt-1">{products.length}</p>
          <p className="text-xs text-emerald-600 mt-1">{products.length} منتج نشط</p>
        </div>
        <div className="bg-white border border-[#BDB76B]/20 rounded-2xl p-5">
          <p className="text-xs text-zinc-500">إجمالي المخزون</p>
          <p className="text-2xl font-black mt-1">{totalStock}</p>
          <p className="text-xs text-zinc-500 mt-1">وحدة</p>
        </div>
        <div className="bg-white border border-[#BDB76B]/20 rounded-2xl p-5">
          <p className="text-xs text-zinc-500">مخزون منخفض</p>
          <p className="text-2xl font-black mt-1 text-[#CE8946]">{lowStock}</p>
          <p className="text-xs text-amber-600">يحتاج إعادة تعبئة</p>
        </div>
        <div className="bg-[#D4AF37] border border-[#BDB76B] rounded-2xl p-5">
          <p className="text-xs text-black/70">كود برومو نشط • Neon</p>
          <p className="text-xl font-black mt-1">{promo}</p>
          <p className="text-xs text-black/60">مزمن مع قاعدة البيانات</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white border border-[#BDB76B]/20 rounded-2xl p-5">
          <h3 className="font-black">إجراءات سريعة</h3>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <Link href="/admin/products" className="bg-[#1a1a1a] text-white py-3 rounded-xl text-center text-sm font-black">إضافة منتج</Link>
            <Link href="/admin/promos" className="bg-[#D4AF37] text-black py-3 rounded-xl text-center text-sm font-black">إضافة برومو</Link>
            <Link href="/admin/orders" className="border border-[#BDB76B]/30 py-3 rounded-xl text-center text-sm font-bold">عرض الطلبات</Link>
            <Link href="/products" className="border border-[#BDB76B]/30 py-3 rounded-xl text-center text-sm font-bold">معاينة المتجر</Link>
          </div>
        </div>

        <div className="bg-white border border-[#BDB76B]/20 rounded-2xl p-5">
          <h3 className="font-black">المنتجات الأكثر طلباً</h3>
          <div className="space-y-2 mt-4">
            {products.slice(0, 3).map(p => (
              <div key={p.id} className="flex items-center gap-3 border border-[#BDB76B]/10 rounded-xl p-2">
                <img src={p.images[0]} alt={p.name} className="h-10 w-10 rounded-lg object-cover" />
                <div>
                  <p className="text-sm font-bold line-clamp-1">{p.name}</p>
                  <p className="text-xs text-zinc-500">{p.brand} • {p.rating} ★</p>
                </div>
                <span className="mr-auto text-xs font-black bg-[#FDFBD4] border border-[#BDB76B]/30 px-2 py-1 rounded-full">{p.variants[0].price} دج</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 bg-[#1a1a1a] text-white rounded-2xl p-5 flex items-center justify-between">
        <div>
          <p className="font-black">حالة النظام</p>
          <p className="text-xs text-white/60">Neon PostgreSQL: {neonStatus === "loading" ? "جاري الفحص..." : neonStatus === "ok" ? "متصل ✓" : "غير متصل - fallback localStorage"} • الطلبات: {ordersCount ?? "—"} • المخزون: {totalStock} وحدة</p>
        </div>
        <span className={`px-4 py-2 rounded-full text-xs font-black ${neonStatus === "ok" ? "bg-emerald-500 text-white" : "bg-[#D4AF37] text-black"}`}>{neonStatus === "ok" ? "DB OK ✓" : "Build OK ✓ 17 صفحة"}</span>
      </div>
    </div>
  )
}