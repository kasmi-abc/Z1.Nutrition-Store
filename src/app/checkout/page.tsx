"use client"
import { useState } from "react"
import Link from "next/link"
import { useCartStore } from "@/store/cart"
import { formatPrice } from "@/lib/utils"

export default function CheckoutPage() {
  const { items, total, clearCart } = useCartStore()
  const t = total()
  const shipping = t >= 10000 ? 0 : 500
  const [promo, setPromo] = useState("")
  const [discount, setDiscount] = useState(0)
  const [promoMsg, setPromoMsg] = useState("")
  const promoDiscount = Math.round(t * (discount / 100))
  const grand = t - promoDiscount + shipping
  const [done, setDone] = useState(false)
  const [lastOrder, setLastOrder] = useState<any>(null)
  const [form, setForm] = useState({ name: "", phone: "", wilaya: "", address: "" })

  const [promoLoading, setPromoLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [submitError, setSubmitError] = useState("")

  const applyPromo = async () => {
    const code = promo.trim().toUpperCase()
    if (!code) return
    setPromoLoading(true)
    setPromoMsg("")
    try {
      const res = await fetch("/api/promos/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, subtotal: t }),
      })
      const data = await res.json()
      if (data.valid) {
        setDiscount(data.promo.discount)
        setPromoMsg(`تم تطبيق ${data.promo.discount}% خصم • توفير ${formatPrice(Math.round(t * (data.promo.discount / 100)))}`)
      } else {
        setDiscount(0)
        setPromoMsg(data.error || "كود غير صالح أو منتهي")
      }
    } catch {
      // fallback local
      try {
        const saved = localStorage.getItem("z1-promos")
        const list = saved ? JSON.parse(saved) : [{ code: "FIT10", discount: 10, active: true }]
        const found = list.find((p: any) => p.code === code && p.active)
        if (found) {
          setDiscount(found.discount)
          setPromoMsg(`تم تطبيق ${found.discount}% خصم`)
        } else {
          setDiscount(0)
          setPromoMsg("كود غير صالح أو منتهي")
        }
      } catch {
        if (code === "FIT10") { setDiscount(10); setPromoMsg("تم تطبيق 10% خصم") }
        else { setDiscount(0); setPromoMsg("كود غير صالح") }
      }
    } finally {
      setPromoLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError("")
    setSubmitLoading(true)
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: form.name,
          phone: form.phone,
          wilaya: form.wilaya,
          address: form.address,
          items: items.map(i => ({
            productId: i.productId,
            variantId: i.variantId,
            name: i.name,
            variantName: i.variantName,
            image: i.image,
            price: i.price,
            quantity: i.quantity,
            isSubscription: i.isSubscription,
          })),
          promoCode: promo.trim() ? promo.trim().toUpperCase() : null,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setSubmitError(data.error || "فشل إنشاء الطلب")
        setSubmitLoading(false)
        return
      }
      const order = data.order
      // Map to display format
      const display = {
        id: order.id,
        tracking: order.tracking,
        customer: order.customerName,
        phone: order.phone,
        wilaya: order.wilaya,
        address: order.address,
        items: order.items,
        subtotal: order.subtotal,
        discount: order.discount,
        promo: order.promoCode,
        shipping: order.shipping,
        total: order.total,
        status: order.status,
        date: new Date(order.createdAt).toISOString().slice(0, 10),
        createdAt: order.createdAt,
      }
      // keep local copy for orders page fallback
      try {
        const raw = localStorage.getItem("z1-orders")
        const orders = raw ? JSON.parse(raw) : []
        orders.unshift(display)
        localStorage.setItem("z1-orders", JSON.stringify(orders))
        localStorage.setItem("z1-last-order", JSON.stringify(display))
      } catch {}
      setLastOrder(display)
      setDone(true)
      clearCart()
    } catch (err) {
      setSubmitError("خطأ في الاتصال، حاول مجدداً")
    } finally {
      setSubmitLoading(false)
    }
  }

  if (done && lastOrder) {
    return (
      <div className="mx-auto max-w-xl px-4 py-8">
        <div className="text-center">
          <div className="h-16 w-16 mx-auto rounded-full bg-emerald-500 text-white flex items-center justify-center text-2xl">✓</div>
          <h1 className="text-2xl font-black mt-4">تم استلام طلبك!</h1>
          <p className="text-sm text-zinc-600 mt-2">شكراً {form.name} - سنتواصل معك على <span dir="ltr">{form.phone}</span> لتأكيد الطلب.</p>
          <div className="inline-flex items-center gap-2 mt-3 bg-amber-100 text-amber-700 border border-amber-200 px-3 py-1 rounded-full text-xs font-black">الحالة: قيد المعالجة</div>
        </div>

        <div className="bg-white border-2 border-[#1a1a1a] rounded-2xl p-6 mt-6 print:border-black">
          <div className="flex items-center justify-between border-b-2 border-[#1a1a1a] pb-3">
            <div className="flex items-center gap-2">
              <img src="/z1-logo.jpg" alt="Z1" className="h-10 w-10 rounded-xl border-2 border-[#D4AF37]" />
              <div>
                <p className="font-black text-sm">Z1 NUTRITION</p>
                <p className="text-[11px] text-zinc-500">وصل نظيف • فاتورة</p>
              </div>
            </div>
            <div className="text-left">
              <p className="text-xs text-zinc-500">فاتورة</p>
              <p className="font-mono text-sm font-black">{lastOrder.id}</p>
              <span className="inline-block mt-1 bg-[#FDFBD4] border border-[#BDB76B]/30 px-2 py-0.5 rounded-full text-xs font-bold tracking-widest">تتبع: {lastOrder.tracking}</span>
            </div>
          </div>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-zinc-500">كود التتبع</span><span className="font-mono font-black tracking-widest bg-[#1a1a1a] text-white px-2 py-1 rounded-full text-xs">{lastOrder.tracking}</span></div>
            <div className="flex justify-between"><span className="text-zinc-500">الحالة</span><span className="bg-amber-100 text-amber-700 border border-amber-200 px-2 py-1 rounded-full text-xs font-black">قيد المعالجة</span></div>
            <div className="flex justify-between"><span className="text-zinc-500">العميل</span><span className="font-bold">{lastOrder.customer} • <span dir="ltr">{lastOrder.phone}</span></span></div>
            <div className="flex justify-between"><span className="text-zinc-500">الولاية</span><span className="text-right max-w-[60%]">{lastOrder.wilaya} • {lastOrder.address}</span></div>
            <div className="border-t-2 border-dashed pt-3 mt-3 space-y-1">
              {lastOrder.items.map((it: any) => (
                <div key={`${it.variantId}-${it.isSubscription}`} className="flex justify-between text-xs py-1 border-b border-zinc-100 last:border-0">
                  <span>{it.name} {it.variantName ? `• ${it.variantName}` : ""} × {it.quantity}</span><span className="font-bold">{formatPrice(it.price * it.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-3 space-y-1">
              <div className="flex justify-between"><span>المجموع</span><span>{formatPrice(lastOrder.subtotal)}</span></div>
              {lastOrder.discount > 0 && <div className="flex justify-between text-emerald-600"><span>خصم {lastOrder.promo}</span><span>-{formatPrice(lastOrder.discount)}</span></div>}
              <div className="flex justify-between"><span>الشحن</span><span>{lastOrder.shipping === 0 ? "مجاني" : formatPrice(lastOrder.shipping)}</span></div>
              <div className="flex justify-between font-black text-base border-t-2 border-[#1a1a1a] pt-2"><span>الإجمالي</span><span className="text-[#CE8946]">{formatPrice(lastOrder.total)}</span></div>
            </div>
          </div>
          <p className="text-[11px] text-zinc-400 text-center mt-4 border-t pt-3">احتفظ بكود التتبع لمتابعة طلبك • Z1 Nutrition • 58 ولاية</p>
          <div className="mt-4 flex gap-2 print:hidden">
            <button type="button" onClick={() => window.print()} className="flex-1 bg-[#1a1a1a] text-white py-2.5 rounded-xl text-sm font-bold">طباعة الوصل النظيف</button>
            <Link href="/orders" className="flex-1 text-center border-2 border-[#1a1a1a] py-2.5 rounded-xl text-sm font-black">تتبع طلباتي</Link>
          </div>
          <div className="mt-2 flex gap-2 print:hidden">
            <Link href="/products" className="flex-1 text-center bg-[#D4AF37] text-black py-2.5 rounded-xl text-sm font-black">متابعة التسوق</Link>
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <p className="font-black">سلتك فارغة</p>
        <Link href="/products" className="inline-block mt-4 bg-black text-white px-6 py-2 rounded-full">تسوق الآن</Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-black">إتمام الطلب</h1>
      <p className="text-sm text-zinc-500">الدفع عند الاستلام • توصيل 58 ولاية • التسعير بالدينار الجزائري</p>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-[1fr_380px] gap-8 mt-6">
        <div className="bg-white border border-[#BDB76B]/20 rounded-2xl p-6 space-y-4">
          <h3 className="font-black">معلومات التوصيل</h3>
          <input placeholder="الاسم الكامل" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} maxLength={80} minLength={2} aria-label="الاسم الكامل" className="w-full border border-[#BDB76B]/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D4AF37]" required />
          <input placeholder="رقم الهاتف (07...)" dir="ltr" type="tel" inputMode="numeric" pattern="0(5|6|7)[0-9]{8}" maxLength={10} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value.replace(/[^0-9]/g, "") })} aria-label="رقم الهاتف" className="w-full border border-[#BDB76B]/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D4AF37] text-right" required />
          <select value={form.wilaya} onChange={e => setForm({ ...form, wilaya: e.target.value })} className="w-full border border-[#BDB76B]/30 rounded-xl px-4 py-3 text-sm bg-white" required>
            <option value="">اختر الولاية (58 ولاية)</option>
            <option>01 - أدرار</option><option>02 - الشلف</option><option>03 - الأغواط</option><option>04 - أم البواقي</option><option>05 - باتنة</option><option>06 - بجاية</option><option>07 - بسكرة</option><option>08 - بشار</option><option>09 - البليدة</option><option>10 - البويرة</option><option>11 - تمنراست</option><option>12 - تبسة</option><option>13 - تلمسان</option><option>14 - تيارت</option><option>15 - تيزي وزو</option><option>16 - الجزائر</option><option>17 - الجلفة</option><option>18 - جيجل</option><option>19 - سطيف</option><option>20 - سعيدة</option><option>21 - سكيكدة</option><option>22 - سيدي بلعباس</option><option>23 - عنابة</option><option>24 - قالمة</option><option>25 - قسنطينة</option><option>26 - المدية</option><option>27 - مستغانم</option><option>28 - المسيلة</option><option>29 - معسكر</option><option>30 - ورقلة</option><option>31 - وهران</option><option>32 - البيض</option><option>33 - إليزي</option><option>34 - برج بوعريريج</option><option>35 - بومرداس</option><option>36 - الطارف</option><option>37 - تندوف</option><option>38 - تيسمسيلت</option><option>39 - الوادي</option><option>40 - خنشلة</option><option>41 - سوق أهراس</option><option>42 - تيبازة</option><option>43 - ميلة</option><option>44 - عين الدفلى</option><option>45 - النعامة</option><option>46 - عين تموشنت</option><option>47 - غرداية</option><option>48 - غليزان</option><option>49 - تيميمون</option><option>50 - برج باجي مختار</option><option>51 - أولاد جلال</option><option>52 - بني عباس</option><option>53 - إن صالح</option><option>54 - إن قزام</option><option>55 - توقرت</option><option>56 - جانت</option><option>57 - المغير</option><option>58 - المنيعة</option>
          </select>
          <textarea placeholder="العنوان بالتفصيل" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} maxLength={200} aria-label="العنوان" className="w-full border border-[#BDB76B]/30 rounded-xl px-4 py-3 text-sm" rows={3} required />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" required /> أوافق على <span className="underline cursor-help" title="الشروط: الدفع عند الاستلام، إرجاع 14 يوم، منتجات أصلية">الشروط والأحكام</span>
          </label>
          {submitError && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">{submitError}</p>}
          <button type="submit" disabled={submitLoading} className="w-full bg-[#D4AF37] text-black py-3.5 rounded-full font-black hover:bg-[#BDB76B] disabled:opacity-60">{submitLoading ? "جاري الإرسال..." : `تأكيد الطلب • ${formatPrice(grand)}`}</button>
          <p className="text-xs text-zinc-500 text-center">✓ منتج أصلي 100% • ✓ إرجاع 14 يوم • ✓ دعم واتساب • مخزون محدّث لحظياً</p>
        </div>

        <div className="bg-white border border-[#BDB76B]/20 rounded-2xl p-6 h-fit">
          <h3 className="font-black">ملخص الطلب</h3>
          <div className="mt-4 space-y-3 max-h-64 overflow-auto">
            {items.map(i => (
              <div key={i.variantId} className="flex gap-3 text-sm border-b border-[#BDB76B]/10 pb-3">
                <img src={i.image} alt={i.name} className="h-12 w-12 rounded-lg object-cover" />
                <div className="flex-1">
                  <p className="font-bold line-clamp-1">{i.name}</p>
                  <p className="text-xs text-zinc-500">{i.variantName} × {i.quantity}</p>
                </div>
                <span className="font-bold text-sm">{formatPrice(i.price * i.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <p className="text-xs font-black mb-2">كود الخصم</p>
            <div className="flex gap-2">
              <input value={promo} onChange={e => setPromo(e.target.value)} placeholder="FIT10" className="flex-1 border border-[#BDB76B]/30 rounded-full px-4 py-2 text-sm" />
              <button type="button" onClick={applyPromo} disabled={promoLoading} className="bg-[#1a1a1a] text-white px-5 py-2 rounded-full text-xs font-black disabled:opacity-60">{promoLoading ? "..." : "تطبيق"}</button>
            </div>
            {promoMsg && <p className={`text-xs mt-2 font-bold ${discount ? "text-emerald-600" : "text-red-600"}`}>{promoMsg}</p>}
          </div>

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span>المجموع</span><span className="font-bold">{formatPrice(t)}</span></div>
            {discount > 0 && <div className="flex justify-between text-emerald-600 font-bold"><span>خصم {discount}%</span><span>-{formatPrice(promoDiscount)}</span></div>}
            <div className="flex justify-between"><span>الشحن</span><span className={shipping === 0 ? "text-emerald-600 font-bold" : ""}>{shipping === 0 ? "مجاني" : formatPrice(shipping)}</span></div>
            <div className="flex justify-between text-lg font-black border-t pt-3"><span>الإجمالي</span><span className="text-[#CE8946]">{formatPrice(grand)}</span></div>
          </div>
        </div>
      </form>
    </div>
  )
}