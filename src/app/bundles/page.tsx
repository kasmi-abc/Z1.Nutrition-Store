"use client"
import Link from "next/link"
import { useState } from "react"
import { useProducts } from "@/hooks/useProducts"
import { addToCartDirect } from "@/store/cart"

const bundles = [
  { id: "b1", name: "باك الضخامة الشامل", price: 39500, oldPrice: 47500, saving: "8000 دج", items: ["Whey Gold 2kg", "Creatine 300g", "Shaker أصلي"], desc: "للمبتدئين والمتوسطين - ضخامة نظيفة", badge: "الأكثر مبيعاً", popular: true, image: "/images/bundles/stack-mass.jpg", productSlugs: ["whey-gold-standard", "creatine-mono-300"] },
  { id: "b2", name: "باك التنشيف", price: 28500, oldPrice: 34000, saving: "5500 دج", items: ["Whey Isolate", "L-Carnitine 1500", "Omega 3"], desc: "حرق دهون مع الحفاظ على العضل", badge: "توفير 16%", image: "/images/bundles/stack-cut.jpg", productSlugs: ["whey-gold-standard", "l-carnitine-1500", "omega3-fish-oil"] },
  { id: "b3", name: "باك الطاقة والتركيز", price: 22500, oldPrice: 27000, saving: "4500 دج", items: ["C4 Pre-Workout", "Creatine", "BCAA"], desc: "طاقة انفجارية وضخ دم", badge: "جديد", image: "/images/bundles/stack-energy.jpg", productSlugs: ["pre-workout-explosive", "creatine-mono-300"] },
]

export default function BundlesPage() {
  const [toast, setToast] = useState<string | null>(null)
  const products = useProducts()

  const handleAddPack = (bundle: typeof bundles[0]) => {
    let added = 0
    bundle.productSlugs.forEach(slug => {
      const p = products.find(pr => pr.slug === slug)
      if (!p) return
      const v = p.variants.find(vv => vv.isDefault) || p.variants[0]
      addToCartDirect({
        productId: p.id,
        variantId: v.id,
        name: p.name,
        variantName: v.name,
        image: p.images[0],
        price: v.price,
        quantity: 1,
        isSubscription: false,
      })
      added++
    })
    setToast(`تمت إضافة ${bundle.name} (${added} منتجات) للسلة`)
    setTimeout(() => setToast(null), 2500)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#1a1a1a] text-white px-6 py-3 rounded-full text-sm font-bold shadow-lg z-50 border-2 border-[#D4AF37]">
          {toast} <Link href="/cart" className="underline mr-2 text-[#D4AF37]">عرض السلة</Link>
        </div>
      )}

      <div className="text-center">
        <h1 className="text-3xl font-black">العروض والـ Bundles</h1>
        <p className="text-sm text-zinc-600 mt-2">حزم مخفضة: بروتين + كرياتين + شيكر بسعر أقل - التسعير بالدينار الجزائري</p>
        <p className="inline-block mt-3 bg-[#CE8946] text-white text-xs font-black px-3 py-1 rounded-full">وفّر حتى 8000 دج عند شراء الـ Pack</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-10">
        {bundles.map(b => (
          <div key={b.id} className={`bg-white border-2 rounded-3xl overflow-hidden ${b.popular ? "border-[#D4AF37] shadow-lg" : "border-[#BDB76B]/20"}`}>
            {b.popular && <div className="bg-[#D4AF37] text-black text-center py-1.5 text-xs font-black">الأكثر مبيعاً • يضم الأكثر طلباً</div>}
            <img src={b.image} alt={b.name} className="w-full h-44 object-cover" />
            <div className="p-6">
              <span className="bg-[#1a1a1a] text-white text-xs font-black px-2.5 py-1 rounded-full">{b.badge}</span>
              <h3 className="font-black text-lg mt-3">{b.name}</h3>
              <p className="text-xs text-zinc-500 mt-1">{b.desc}</p>
              <ul className="mt-4 space-y-2">
                {b.items.map(it => (
                  <li key={it} className="flex items-center gap-2 text-sm">
                    <span className="h-5 w-5 rounded-full bg-[#FDFBD4] border border-[#BDB76B] flex items-center justify-center text-[10px]">✓</span> {it}
                  </li>
                ))}
              </ul>
              <div className="mt-6 bg-[#FDFBD4] border border-[#BDB76B]/30 rounded-xl p-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-[#CE8946]">{b.price.toLocaleString("ar-DZ")} دج</span>
                  <span className="text-sm line-through text-zinc-400">{b.oldPrice.toLocaleString("ar-DZ")} دج</span>
                </div>
                <p className="text-xs font-bold text-emerald-600 mt-1">توفر {b.saving}</p>
              </div>
              <button type="button" onClick={() => handleAddPack(b)} className={`w-full mt-4 py-3 rounded-full font-black text-sm ${b.popular ? "bg-[#D4AF37] text-black" : "bg-[#1a1a1a] text-white"}`}>أضف الـ Pack للسلة</button>
              <Link href="/products" className="block text-center text-xs underline mt-2">أو تسوق المنتجات منفردة</Link>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 bg-white border border-[#BDB76B]/20 rounded-2xl p-6 grid md:grid-cols-3 gap-6 text-center">
        <div><p className="font-black">شحن مجاني</p><p className="text-xs text-zinc-500">للـ Packs فوق 10000 دج</p></div>
        <div><p className="font-black">منتجات أصلية</p><p className="text-xs text-zinc-500">مع فاتورة وضمان</p></div>
        <div><p className="font-black">دفع عند الاستلام</p><p className="text-xs text-zinc-500">58 ولاية</p></div>
      </div>
    </div>
  )
}