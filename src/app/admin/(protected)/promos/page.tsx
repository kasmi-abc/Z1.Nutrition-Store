"use client"
import { useState, useEffect } from "react"

type Promo = { id: string; code: string; discount: number; expiry: string; active: boolean; uses: number }

const LS_KEY = "z1-promos"
const initial: Promo[] = [
  { id: "1", code: "FIT10", discount: 10, expiry: "2026-12-31", active: true, uses: 124 },
  { id: "2", code: "RAMADAN15", discount: 15, expiry: "2026-03-15", active: false, uses: 89 },
]

export default function PromosPage() {
  const [promos, setPromos] = useState<Promo[]>([])
  const [form, setForm] = useState({ code: "", discount: "", expiry: "" })
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState("")

  const fetchPromos = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/promos?admin=1", { cache: "no-store" })
      if (res.ok) {
        const data = await res.json()
        const mapped: Promo[] = data.promos.map((p: any) => ({
          id: p.id,
          code: p.code,
          discount: p.discount,
          expiry: new Date(p.expiry).toISOString().slice(0, 10),
          active: p.active,
          uses: p.uses,
        }))
        setPromos(mapped)
        setLoading(false)
        return
      }
    } catch {}
    const s = localStorage.getItem(LS_KEY)
    setPromos(s ? JSON.parse(s) : initial)
    setLoading(false)
  }

  useEffect(() => { fetchPromos() }, [])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setMsg("")
    try {
      const res = await fetch("/api/promos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: form.code.toUpperCase(), discount: Number(form.discount), expiry: form.expiry }),
      })
      const data = await res.json()
      if (!res.ok) { setMsg(data.error || "فشل الإضافة"); return }
      setForm({ code: "", discount: "", expiry: "" })
      setShow(false)
      fetchPromos()
    } catch {
      // fallback local
      const p: Promo = { id: Date.now().toString(), code: form.code.toUpperCase(), discount: Number(form.discount), expiry: form.expiry, active: true, uses: 0 }
      const next = [p, ...promos]
      setPromos(next)
      localStorage.setItem(LS_KEY, JSON.stringify(next))
      setForm({ code: "", discount: "", expiry: "" })
      setShow(false)
    }
  }

  const toggle = async (code: string, current: boolean) => {
    try {
      const res = await fetch(`/api/promos/${code}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ active: !current }) })
      if (res.ok) fetchPromos()
      else {
        // fallback
        const next = promos.map(p => p.code === code ? { ...p, active: !p.active } : p)
        setPromos(next)
        localStorage.setItem(LS_KEY, JSON.stringify(next))
      }
    } catch {
      const next = promos.map(p => p.code === code ? { ...p, active: !p.active } : p)
      setPromos(next)
      localStorage.setItem(LS_KEY, JSON.stringify(next))
    }
  }
  const del = async (code: string) => {
    if (!confirm("حذف الكود؟")) return
    try {
      const res = await fetch(`/api/promos/${code}`, { method: "DELETE" })
      if (res.ok) fetchPromos()
      else {
        const next = promos.filter(p => p.code !== code)
        setPromos(next)
        localStorage.setItem(LS_KEY, JSON.stringify(next))
      }
    } catch {
      const next = promos.filter(p => p.code !== code)
      setPromos(next)
      localStorage.setItem(LS_KEY, JSON.stringify(next))
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black">أكواد البرومو</h1>
          <p className="text-sm text-zinc-500">إدارة أكواد الخصم للمتجر</p>
        </div>
        <button type="button" onClick={() => setShow(!show)} className="bg-[#D4AF37] text-black px-5 py-2 rounded-full text-sm font-black">{show ? "إلغاء" : "إضافة كود"}</button>
      </div>

      {show && (
        <form onSubmit={handleAdd} className="bg-white border border-[#BDB76B]/20 rounded-2xl p-5 mt-4 grid md:grid-cols-3 gap-3">
          <input placeholder="الكود (مثال WELCOME15)" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} className="border border-[#BDB76B]/30 rounded-xl px-3 py-2.5 text-sm" required />
          <input placeholder="نسبة الخصم (مثال 15)" type="number" value={form.discount} onChange={e => setForm({ ...form, discount: e.target.value })} className="border border-[#BDB76B]/30 rounded-xl px-3 py-2.5 text-sm" required />
          <input type="date" value={form.expiry} onChange={e => setForm({ ...form, expiry: e.target.value })} className="border border-[#BDB76B]/30 rounded-xl px-3 py-2.5 text-sm" required />
          <button type="submit" className="md:col-span-3 bg-[#1a1a1a] text-white py-3 rounded-xl font-black">حفظ الكود</button>
        </form>
      )}

      {loading ? <p className="text-sm text-center mt-6">جاري التحميل من Neon...</p> : (
        <div className="mt-6 grid gap-3">
          {promos.map(p => (
            <div key={p.id} className="bg-white border border-[#BDB76B]/15 rounded-2xl p-4 flex items-center gap-4">
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center font-black ${p.active ? "bg-[#D4AF37] text-black" : "bg-zinc-100 text-zinc-400"}`}>{p.discount}%</div>
              <div className="flex-1">
                <p className="font-black tracking-widest">{p.code} {p.active ? <span className="bg-emerald-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">نشط</span> : <span className="bg-zinc-200 text-zinc-600 text-[10px] px-1.5 py-0.5 rounded-full">موقف</span>}</p>
                <p className="text-xs text-zinc-500">ينتهي {p.expiry} • استخدم {p.uses} مرة</p>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => toggle(p.code, p.active)} className="text-xs font-bold border border-[#BDB76B]/30 px-3 py-1.5 rounded-full hover:bg-[#FDFBD4]">{p.active ? "إيقاف" : "تفعيل"}</button>
                <button type="button" onClick={() => del(p.code)} className="text-xs text-red-600 underline">حذف</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {msg && <p className="text-sm text-red-600 mt-3">{msg}</p>}

      <div className="mt-6 bg-[#1a1a1a] text-white rounded-2xl p-5">
        <p className="font-black text-sm">كيف يستخدم؟</p>
        <p className="text-xs text-white/60 mt-1">العميل يكتب الكود في Checkout في حقل "كود الخصم" ويطبق الخصم تلقائياً. يمكنك تفعيل/إيقاف أي كود فوراً.</p>
      </div>
    </div>
  )
}