"use client"
import { useState } from "react"
import Link from "next/link"
import { formatPrice } from "@/lib/utils"

type Order = {
  id: string
  tracking?: string
  customer: string
  phone: string
  wilaya?: string
  address?: string
  items?: any[]
  subtotal?: number
  discount?: number
  promo?: string | null
  shipping?: number
  total: number
  status: "pending" | "shipped" | "delivered" | "cancelled"
  date: string
}

export default function OrdersPage() {
  const [code, setCode] = useState("")
  const [result, setResult] = useState<Order | null>(null)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  const [loading, setLoading] = useState(false)
  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(""); setResult(null)
    const q = code.trim().toUpperCase()
    if (!q) { setError("أدخل كود التتبع"); return }
    setLoading(true)
    try {
      // Try API first (Neon)
      const res = await fetch(`/api/orders?tracking=${encodeURIComponent(q)}`)
      if (res.ok) {
        const data = await res.json()
        const o = data.order
        const mapped: Order = {
          id: o.id,
          tracking: o.tracking,
          customer: o.customerName,
          phone: o.phone,
          wilaya: o.wilaya,
          address: o.address,
          items: JSON.parse(typeof o.items === "string" ? o.items : JSON.stringify(o.items)),
          subtotal: o.subtotal,
          discount: o.discount,
          promo: o.promoCode,
          shipping: o.shipping,
          total: o.total,
          status: o.status,
          date: new Date(o.createdAt).toISOString().slice(0, 10),
        }
        setResult(mapped)
        setLoading(false)
        return
      }
    } catch {}
    // Fallback localStorage
    try {
      const raw = localStorage.getItem("z1-orders")
      const orders: Order[] = raw ? JSON.parse(raw) : []
      const found = orders.find(o => (o.tracking || o.id).toUpperCase() === q || o.id.toUpperCase() === q)
      if (!found) setError("كود التتبع غير موجود - تأكد من الحروف والأرقام (جرب TRK-... من وصل Checkout)")
      else setResult(found)
    } catch { setError("خطأ في قراءة الطلبات") }
    finally { setLoading(false) }
  }

  const copyTracking = () => {
    if (!result) return
    navigator.clipboard?.writeText(result.tracking || result.id)
    setCopied(true); setTimeout(() => setCopied(false), 1500)
  }

  const statusColor: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700 border-amber-200",
    shipped: "bg-blue-100 text-blue-700 border-blue-200",
    delivered: "bg-emerald-100 text-emerald-700 border-emerald-200",
    cancelled: "bg-zinc-100 text-zinc-600 border-zinc-200",
  }
  const statusLabel: Record<string, string> = { pending: "قيد المعالجة", shipped: "تم الشحن", delivered: "تم التوصيل", cancelled: "ملغى" }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-black">تتبع طلبك</h1>
      <p className="text-sm text-zinc-500 mt-1">أمان: لا يظهر أي طلب إلا إذا أدخلت كود التتبع الصحيح (مثل TRK-...). انسخه من وصل Checkout.</p>

      <form onSubmit={handleTrack} className="bg-white border border-[#BDB76B]/20 rounded-2xl p-6 mt-6">
        <label className="text-xs font-black">كود التتبع *</label>
        <div className="flex gap-2 mt-2">
          <input value={code} onChange={e => setCode(e.target.value)} placeholder="TRK-12345678" className="flex-1 border border-[#BDB76B]/30 rounded-full px-4 py-3 text-sm font-mono tracking-widest focus:outline-none focus:border-[#D4AF37]" required />
          <button type="submit" disabled={loading} className="bg-[#1a1a1a] text-white px-6 py-3 rounded-full text-sm font-black disabled:opacity-60">{loading ? "..." : "تتبع"}</button>
        </div>
        <p className="text-[11px] text-zinc-500 mt-2">تجد الكود في وصل الطلب بعد التأكيد وفي صفحة الطلبات، انسخه هنا. لن نعرض أي طلبات أخرى تلقائياً.</p>
        {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3 mt-3">{error}</p>}
      </form>

      {result && (
        <div className="bg-white border-2 border-[#1a1a1a] rounded-2xl p-6 mt-6" id="print-receipt">
          <div className="flex items-center justify-between border-b-2 border-[#1a1a1a] pb-3">
            <div className="flex items-center gap-2">
              <img src="/z1-logo.jpg" alt="Z1" className="h-9 w-9 rounded-xl border-2 border-[#D4AF37]" />
              <div>
                <p className="font-black text-sm">Z1 NUTRITION</p>
                <p className="text-[11px] text-zinc-500">وصل نظيف • {statusLabel[result.status]}</p>
              </div>
            </div>
            <div className="text-left">
              <p className="text-xs text-zinc-500">فاتورة</p>
              <p className="font-mono text-sm font-black">{result.id}</p>
            </div>
          </div>

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-zinc-500">كود التتبع</span><button type="button" onClick={copyTracking} className="font-mono font-black tracking-widest bg-[#FDFBD4] border border-[#BDB76B]/30 px-2 py-1 rounded-full text-xs flex items-center gap-1">{result.tracking || result.id} <span className="text-[10px]">{copied ? "✓" : "⎘"}</span></button></div>
            <div className="flex justify-between"><span className="text-zinc-500">الحالة</span><span className={`px-2 py-1 rounded-full text-xs font-black border ${statusColor[result.status]}`}>{statusLabel[result.status]}</span></div>
            <div className="flex justify-between"><span className="text-zinc-500">العميل</span><span className="font-bold">{result.customer}</span></div>
            <div className="flex justify-between"><span className="text-zinc-500">التاريخ</span><span>{result.date}</span></div>
            {result.wilaya && <div className="flex justify-between"><span className="text-zinc-500">الولاية</span><span className="text-right max-w-[60%]">{result.wilaya} - {result.address}</span></div>}
          </div>

          {result.items && (
            <div className="mt-4 border-t-2 border-dashed pt-4">
              {result.items.map((it: any, idx: number) => (
                <div key={idx} className="flex justify-between text-sm py-1.5 border-b border-zinc-100 last:border-0">
                  <span>{it.name} {it.variantName ? `• ${it.variantName}` : ""} × {it.quantity}</span><span className="font-bold">{formatPrice(it.price * it.quantity)}</span>
                </div>
              ))}
              <div className="flex justify-between font-black text-base border-t-2 border-[#1a1a1a] pt-3 mt-3"><span>الإجمالي</span><span className="text-[#CE8946]">{formatPrice(result.total)}</span></div>
            </div>
          )}

          <div className="mt-6 flex gap-2 print:hidden">
            <button type="button" onClick={() => window.print()} className="flex-1 bg-[#1a1a1a] text-white py-2.5 rounded-xl text-sm font-bold">طباعة الوصل</button>
            <button type="button" onClick={() => setResult(null)} className="flex-1 border border-[#BDB76B]/30 py-2.5 rounded-xl text-sm font-bold">بحث جديد</button>
          </div>
        </div>
      )}

      <div className="mt-8 bg-[#FDFBD4] border border-[#BDB76B]/20 rounded-2xl p-5 text-xs">
        <p className="font-black">لم تستلم الكود؟</p>
        <p className="text-zinc-600 mt-1">بعد تأكيد الطلب في Checkout يظهر الوصل مباشرة. انسخ كود التتبع هناك أو تواصل عبر واتساب 0775 12 34 56.</p>
        <Link href="/products" className="inline-block mt-3 bg-white border border-[#BDB76B] px-4 py-2 rounded-full font-black">تسوق الآن</Link>
      </div>
    </div>
  )
}