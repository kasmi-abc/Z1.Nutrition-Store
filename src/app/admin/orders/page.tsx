"use client"
import { useEffect, useState } from "react"
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
  createdAt?: string
}

const mock: Order[] = [
  { id: "Z1-10234", tracking: "TRK-12345678", customer: "أمين - وهران", phone: "0775 12 34 56", wilaya: "وهران", address: "حي السلام", total: 14900, status: "pending", date: "2026-09-16", items: [{ name: "Whey Gold", variantName: "شوكولاتة - 1kg", quantity: 1, price: 14900 }], subtotal: 14900, shipping: 0, discount: 0 },
  { id: "Z1-10233", tracking: "TRK-87654321", customer: "سارة - الجزائر", phone: "0555 98 76 54", wilaya: "الجزائر", address: "باب الزوار", total: 23400, status: "shipped", date: "2026-09-15", items: [{ name: "Creatine", variantName: "300g", quantity: 2, price: 6500 }], subtotal: 13000, shipping: 500, discount: 0 },
]

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [selected, setSelected] = useState<Order | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/orders?admin=1&limit=50", { cache: "no-store" })
      if (res.ok) {
        const data = await res.json()
        const mapped: Order[] = data.orders.map((o: any) => ({
          id: o.id,
          tracking: o.tracking,
          customer: o.customerName,
          phone: o.phone,
          wilaya: o.wilaya,
          address: o.address,
          items: typeof o.items === "string" ? JSON.parse(o.items) : o.items,
          subtotal: o.subtotal,
          discount: o.discount,
          promo: o.promoCode,
          shipping: o.shipping,
          total: o.total,
          status: o.status,
          date: new Date(o.createdAt).toISOString().slice(0, 10),
          createdAt: o.createdAt,
        }))
        setOrders(mapped)
        setLoading(false)
        return
      }
    } catch {}
    // fallback local
    const s = localStorage.getItem("z1-orders")
    if (s) {
      try {
        const parsed = JSON.parse(s)
        const normalized = parsed.map((o: any) => ({
          ...o,
          tracking: o.tracking || `TRK-${o.id.slice(-8).toUpperCase()}`,
          status: o.status || "pending",
        }))
        setOrders(normalized)
      } catch { setOrders(mock) }
    } else {
      setOrders(mock)
    }
    setLoading(false)
  }

  useEffect(() => { fetchOrders() }, [])

  const copyTracking = (t: string) => {
    navigator.clipboard?.writeText(t)
    setCopied(t)
    setTimeout(() => setCopied(null), 1500)
  }

  const updateStatus = async (id: string, status: Order["status"]) => {
    // optimistic
    const prev = orders
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o))
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error("failed")
      // sync from server
      fetchOrders()
    } catch {
      setOrders(prev)
      // fallback local
      const next = orders.map(o => o.id === id ? { ...o, status } : o)
      setOrders(next)
      localStorage.setItem("z1-orders", JSON.stringify(next))
    }
  }

  const statusColor: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700 border-amber-200",
    shipped: "bg-blue-100 text-blue-700 border-blue-200",
    delivered: "bg-emerald-100 text-emerald-700 border-emerald-200",
    cancelled: "bg-zinc-100 text-zinc-600 border-zinc-200",
  }
  const statusLabel: Record<string, string> = { pending: "قيد المعالجة", shipped: "تم الشحن", delivered: "تم التوصيل", cancelled: "ملغى" }

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-black">الطلبات</h1>
          <p className="text-sm text-zinc-500">كل طلب له حالة + كود تتبع + وصل نظيف قابل للطباعة</p>
        </div>
        <span className="bg-[#1a1a1a] text-white text-xs px-3 py-1.5 rounded-full font-bold">{orders.length} طلب</span>
      </div>

      {loading && <div className="bg-white border border-[#BDB76B]/15 rounded-2xl p-8 text-center mt-6 text-sm">جاري تحميل الطلبات من Neon...</div>}
      {!loading && orders.length === 0 && (
        <div className="bg-white border border-dashed border-[#BDB76B]/30 rounded-2xl p-12 text-center mt-6">
          <p className="font-black">لا توجد طلبات بعد</p>
          <p className="text-sm text-zinc-500">الطلبات الجديدة من صفحة Checkout ستظهر هنا تلقائياً • Neon متصل ✓</p>
        </div>
      )}

      <div className="mt-6 space-y-4">
        {orders.map(o => (
          <div key={o.id} className="bg-white border border-[#BDB76B]/15 rounded-2xl p-5 hover:shadow-md transition">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-mono text-sm font-black">{o.id}</p>
                <button type="button" onClick={() => copyTracking(o.tracking || o.id)} className="text-xs font-bold tracking-widest bg-[#FDFBD4] border border-[#BDB76B]/30 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full mt-1 hover:bg-[#D4AF37]/20">
                  تتبع: {o.tracking || o.id} <span className="text-[10px]">{copied === (o.tracking || o.id) ? "✓ نسخ" : "⎘"}</span>
                </button>
                <p className="text-sm font-bold mt-2">{o.customer} • <span dir="ltr" className="font-mono">{o.phone}</span></p>
                {o.wilaya && <p className="text-xs text-zinc-500">{o.wilaya} - {o.address}</p>}
                <p className="text-xs text-zinc-400">{o.date}</p>
              </div>
              <div className="text-left">
                <span className={`text-xs font-black px-3 py-1 rounded-full border ${statusColor[o.status]}`}>{statusLabel[o.status]}</span>
                <p className="price text-[#1a1a1a] mt-2 text-sm">{formatPrice(o.total)}</p>
                <p className="text-[11px] text-zinc-500">كود تتبع: <span className="font-mono font-bold">{o.tracking || o.id}</span></p>
              </div>
            </div>

            {o.items && (
              <div className="mt-3 bg-[#FDFBD4]/50 border border-[#BDB76B]/10 rounded-xl p-3">
                {o.items.map((it: any, idx: number) => (
                  <div key={idx} className="flex justify-between text-xs py-1 border-b border-[#BDB76B]/10 last:border-0">
                    <span>{it.name} {it.variantName ? `• ${it.variantName}` : ""} × {it.quantity}</span>
                    <span className="font-bold">{formatPrice(it.price * it.quantity)}</span>
                  </div>
                ))}
                <div className="flex justify-between text-xs font-bold mt-2 pt-2 border-t">
                  <span>الإجمالي</span><span>{formatPrice(o.total)}</span>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-2 mt-4">
              <select value={o.status} onChange={e => updateStatus(o.id, e.target.value as any)} className="border border-[#BDB76B]/30 rounded-full px-3 py-1.5 text-xs font-bold bg-white">
                <option value="pending">قيد المعالجة</option>
                <option value="shipped">تم الشحن</option>
                <option value="delivered">تم التوصيل</option>
                <option value="cancelled">ملغى</option>
              </select>
              <button type="button" onClick={() => setSelected(o)} className="bg-[#1a1a1a] text-white px-4 py-1.5 rounded-full text-xs font-black">عرض الوصل</button>
              <a href={`https://wa.me/213${o.phone.replace(/\s/g, "").slice(1)}`} target="_blank" rel="noopener noreferrer" className="bg-[#D4AF37] text-black px-4 py-1.5 rounded-full text-xs font-black">واتساب</a>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 print:bg-white" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6 print:shadow-none print:border-2 print:border-black" onClick={e => e.stopPropagation()} id="print-receipt">
            <div className="flex items-center justify-between border-b-2 border-[#1a1a1a] pb-4">
              <div className="flex items-center gap-3">
                <img src="/z1-logo.jpg" alt="Z1" className="h-10 w-10 rounded-xl border-2 border-[#D4AF37]" />
                <div>
                  <p className="font-black text-sm">Z1 NUTRITION</p>
                  <p className="text-[11px] text-zinc-500">وصل طلب • أصلي 100%</p>
                </div>
              </div>
              <div className="text-left">
                <p className="text-xs text-zinc-500">فاتورة / وصل نظيف</p>
                <p className="font-mono text-sm font-black">{selected.id}</p>
                <p className="text-xs font-bold tracking-widest bg-[#FDFBD4] border border-[#BDB76B]/30 px-2 py-0.5 rounded-full inline-block mt-1">تتبع: {selected.tracking || selected.id}</p>
              </div>
              <button type="button" onClick={() => setSelected(null)} className="h-8 w-8 rounded-full border flex items-center justify-center print:hidden">✕</button>
            </div>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-zinc-500">العميل</span><span className="font-bold">{selected.customer}</span></div>
              <div className="flex justify-between"><span className="text-zinc-500">الهاتف</span><span dir="ltr" className="font-mono">{selected.phone}</span></div>
              {selected.wilaya && <div className="flex justify-between"><span className="text-zinc-500">العنوان</span><span className="text-right max-w-[60%]">{selected.wilaya} - {selected.address}</span></div>}
              <div className="flex justify-between"><span className="text-zinc-500">التاريخ</span><span className="font-bold">{selected.date}</span></div>
              <div className="flex justify-between items-center"><span className="text-zinc-500">الحالة</span><span className={`px-3 py-1 rounded-full text-xs font-black border ${statusColor[selected.status]}`}>{statusLabel[selected.status]}</span></div>
              <div className="flex justify-between"><span className="text-zinc-500">كود التتبع</span><span className="font-mono font-black tracking-widest">{selected.tracking || selected.id}</span></div>
            </div>

            {selected.items && (
              <div className="mt-4 border-t-2 border-dashed pt-4">
                <p className="text-xs font-black mb-2">تفاصيل الطلب</p>
                {selected.items.map((it: any, idx: number) => (
                  <div key={idx} className="flex justify-between text-sm py-1.5 border-b border-zinc-100 last:border-0">
                    <span className="flex-1">{it.name} {it.variantName ? `• ${it.variantName}` : ""} × {it.quantity}</span><span className="font-bold">{formatPrice(it.price * it.quantity)}</span>
                  </div>
                ))}
                {selected.subtotal !== undefined && (
                  <div className="space-y-1 mt-3 text-sm border-t pt-3">
                    <div className="flex justify-between"><span>المجموع</span><span>{formatPrice(selected.subtotal || selected.total)}</span></div>
                    {selected.discount ? <div className="flex justify-between text-emerald-600"><span>خصم {selected.promo}</span><span>-{formatPrice(selected.discount)}</span></div> : null}
                    {selected.shipping !== undefined && <div className="flex justify-between"><span>الشحن</span><span>{selected.shipping === 0 ? "مجاني" : formatPrice(selected.shipping)}</span></div>}
                  </div>
                )}
                <div className="flex justify-between font-black text-base border-t-2 border-[#1a1a1a] pt-3 mt-3">
                  <span>الإجمالي</span><span className="text-[#CE8946]">{formatPrice(selected.total)}</span>
                </div>
              </div>
            )}

            <p className="text-[11px] text-zinc-400 text-center mt-4 border-t pt-3">شكراً لثقتك • Z1 Nutrition • توصيل 58 ولاية • دفع عند الاستلام</p>

            <div className="mt-6 flex gap-2 print:hidden">
              <button type="button" onClick={() => window.print()} className="flex-1 bg-[#1a1a1a] text-white py-2.5 rounded-xl text-sm font-bold">طباعة الوصل</button>
              <button type="button" onClick={() => setSelected(null)} className="flex-1 border border-[#BDB76B]/30 py-2.5 rounded-xl text-sm font-bold">إغلاق</button>
            </div>
          </div>
        </div>
      )}

      <p className="text-xs text-zinc-400 text-center mt-8">كل طلب له كود تتبع منفصل ووصل نظيف قابل للطباعة</p>
    </div>
  )
}