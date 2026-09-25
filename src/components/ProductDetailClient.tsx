"use client"
import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Product } from "@/types"
import { formatPrice, calcDiscount } from "@/lib/utils"
import { addToCartDirect } from "@/store/cart"
import { IconStar, IconCheck, IconTruck, IconPhone } from "@/components/Icons"

export function ProductDetailClient({ product }: { product: Product }) {
  const router = useRouter()
  const defaultVariant = product.variants.find(v => v.isDefault) || product.variants[0]
  const [selectedId, setSelectedId] = useState(defaultVariant.id)
  const [qty, setQty] = useState(1)
  const [isSub, setIsSub] = useState(false)
  const [activeImage, setActiveImage] = useState(0)
  const [toast, setToast] = useState<string | null>(null)
  const [reviews, setReviews] = useState(product.reviews)
  const [newRating, setNewRating] = useState(5)
  const [newComment, setNewComment] = useState("")
  const [newName, setNewName] = useState("")
  const [activeTab, setActiveTab] = useState<"nutrition" | "ingredients" | "usage">("nutrition")

  const selected = useMemo(() => product.variants.find(v => v.id === selectedId) || defaultVariant, [selectedId, product.variants, defaultVariant])

  // Sync quantity and image when variant changes
  useEffect(() => {
    setQty(q => {
      if (selected.stock === 0) return 1
      return q > selected.stock ? selected.stock : q
    })
    if (selected.image) setActiveImage(0)
  }, [selected.id, selected.stock, selected.image])

  const basePrice = selected.price
  const subPrice = product.isSubscription && isSub ? Math.round(basePrice * (1 - product.subscriptionDiscount / 100)) : basePrice
  const discount = calcDiscount(subPrice, selected.compareAtPrice)
  const saving = basePrice - subPrice
  const displayImage = selected.image || product.images[activeImage] || product.images[0]

  const handleAdd = () => {
    if (selected.stock === 0) return
    addToCartDirect({
      productId: product.id,
      variantId: selected.id,
      name: product.name,
      variantName: selected.name,
      image: selected.image || product.images[0],
      price: subPrice,
      quantity: qty,
      isSubscription: isSub,
    })
    setToast(`تمت إضافة ${qty} × ${selected.name} للسلة ${isSub ? " (اشتراك)" : ""}`)
    setTimeout(() => setToast(null), 2500)
  }

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault()
    const name = newName.trim().slice(0, 40)
    const comment = newComment.trim().slice(0, 500)
    if (!comment || !name) return
    // Sanitize user input
    const safeName = name.replace(/[<>]/g, "")
    const safeComment = comment.replace(/[<>]/g, "")
    const r = { id: Date.now().toString(), userName: safeName, rating: newRating, comment: safeComment, createdAt: new Date().toISOString() }
    setReviews([r, ...reviews])
    setNewComment(""); setNewName("")
  }

  return (
    <div>
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#1a1a1a] text-white px-6 py-3 rounded-full text-sm font-bold shadow-lg z-50 border-2 border-[#D4AF37]">
          {toast} <Link href="/cart" className="underline mr-2 text-[#D4AF37]">عرض السلة</Link>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-10">
        {/* gallery */}
        <div>
          <div className="bg-white border border-[#BDB76B]/20 rounded-3xl p-4 group overflow-hidden">
            <div className="overflow-hidden rounded-2xl">
              <img src={displayImage} alt={`${product.name} - صورة ${activeImage + 1} من ${product.images.length}`} loading="lazy" className="w-full aspect-square object-cover rounded-2xl group-hover:scale-125 transition duration-700 cursor-zoom-in" />
            </div>
            <p className="text-xs text-zinc-400 text-center mt-2">مرر للزووم • الصورة {activeImage + 1} من {product.images.length}</p>
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 mt-3">
              {product.images.map((img, i) => (
                <button key={i} type="button" onClick={() => setActiveImage(i)} className={`h-20 w-20 rounded-xl overflow-hidden border-2 shrink-0 transition ${activeImage === i && !selected.image ? "border-[#D4AF37] ring-2 ring-[#D4AF37]/20" : "border-[#BDB76B]/20 hover:border-[#D4AF37]/50"}`}>
                  <img src={img} alt={`صورة ${i + 1}`} className="w-full h-full object-cover hover:opacity-80" />
                </button>
              ))}
            </div>
          )}

          {/* Trust badges */}
          <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
            <div className="bg-white border border-[#BDB76B]/20 rounded-xl p-3 text-center">
              <IconCheck className="h-5 w-5 mx-auto text-[#CE8946]" />
              <p className="font-black mt-1">أصلي 100%</p>
              <p className="text-zinc-500 text-[11px]">مضمون</p>
            </div>
            <div className="bg-white border border-[#BDB76B]/20 rounded-xl p-3 text-center">
              <IconTruck className="h-5 w-5 mx-auto text-[#CE8946]" />
              <p className="font-black mt-1">58 ولاية</p>
              <p className="text-zinc-500 text-[11px]">24-48 ساعة</p>
            </div>
            <div className="bg-white border border-[#BDB76B]/20 rounded-xl p-3 text-center">
              <IconPhone className="h-5 w-5 mx-auto text-[#CE8946]" />
              <p className="font-black mt-1">دفع آمن</p>
              <p className="text-zinc-500 text-[11px]">عند الاستلام</p>
            </div>
          </div>

          {/* Nutrition Tabs */}
          <div className="mt-6 bg-white border border-[#BDB76B]/20 rounded-2xl overflow-hidden">
            <div className="flex border-b border-[#BDB76B]/20">
              <button type="button" onClick={() => setActiveTab("nutrition")} className={`flex-1 py-3 text-xs font-black ${activeTab === "nutrition" ? "bg-[#1a1a1a] text-white" : "hover:bg-[#FDFBD4]"}`}>القيم الغذائية</button>
              <button type="button" onClick={() => setActiveTab("ingredients")} className={`flex-1 py-3 text-xs font-black ${activeTab === "ingredients" ? "bg-[#1a1a1a] text-white" : "hover:bg-[#FDFBD4]"}`}>المكونات</button>
              <button type="button" onClick={() => setActiveTab("usage")} className={`flex-1 py-3 text-xs font-black ${activeTab === "usage" ? "bg-[#1a1a1a] text-white" : "hover:bg-[#FDFBD4]"}`}>طريقة الاستخدام</button>
            </div>
            <div className="p-5">
              {activeTab === "nutrition" && (
                product.nutrition ? (
                  <div>
                    <div className="bg-[#1a1a1a] text-white rounded-xl p-3 flex justify-between text-xs font-black">
                      <span>الحصة: {product.nutrition.servingSize}</span>
                      <span>{product.nutrition.servings} حصة</span>
                    </div>
                    <table className="w-full text-sm mt-3">
                      <tbody>
                        <tr className="border-b"><td className="py-2 font-bold">السعرات</td><td className="text-left font-black">{product.nutrition.calories}</td></tr>
                        <tr className="border-b"><td className="py-2">بروتين</td><td className="text-left font-black text-[#CE8946]">{product.nutrition.protein}</td></tr>
                        <tr className="border-b"><td className="py-2">كارب</td><td className="text-left">{product.nutrition.carbs}</td></tr>
                        <tr className="border-b"><td className="py-2">دهون</td><td className="text-left">{product.nutrition.fat}</td></tr>
                        <tr><td className="py-2">سكر</td><td className="text-left">{product.nutrition.sugar}</td></tr>
                      </tbody>
                    </table>
                    <p className="text-xs text-zinc-500 mt-3">صور جدول القيم الغذائية واضحة على العبوة. القراءة لأغراض التوعية فقط.</p>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-sm text-zinc-600">القيم الغذائية غير متوفرة لهذا المنتج حالياً.</p>
                    <p className="text-xs text-zinc-400 mt-1">راجع صور العبوة أو تواصل معنا عبر واتساب.</p>
                  </div>
                )
              )}
              {activeTab === "ingredients" && (
                <div>
                  <p className="text-sm font-black">المكونات:</p>
                  <p className="text-sm text-zinc-700 mt-2 leading-relaxed">{product.ingredients || "مكونات نقية وآمنة. راجع ملصق العبوة للتفاصيل الكاملة."}</p>
                  <p className="text-xs text-zinc-500 mt-3">خلف العبوة يحتوي على التفاصيل الكاملة والمكونات الدقيقة.</p>
                </div>
              )}
              {activeTab === "usage" && (
                <div>
                  <p className="text-sm font-black">طريقة الاستخدام:</p>
                  <p className="text-sm text-zinc-700 mt-2 leading-relaxed">{product.usage || "اتبع تعليمات العبوة واستشر مختص تغذية."}</p>
                  <ul className="text-xs text-zinc-600 mt-3 list-disc list-inside space-y-1">
                    <li>لا تتجاوز الجرعة اليومية الموصى بها</li>
                    <li>يحفظ في مكان بارد وجاف</li>
                    <li>ليس بديلاً عن نظام غذائي متوازن</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info */}
        <div>
          <p className="text-sm text-zinc-500 font-bold">{product.brand} • <Link href={`/products?category=${product.category.slug}`} className="underline decoration-[#D4AF37]">{product.category.name}</Link></p>
          <h1 className="text-3xl font-black mt-1">{product.name}</h1>
     {/* /*/}
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
            <span className="bg-[#1a1a1a] text-white px-3 py-1 rounded-full font-bold">SKU: {selected.sku}</span>
            <span className="bg-white border border-[#BDB76B]/30 px-3 py-1 rounded-full font-bold">slug: {product.slug}</span>
            <span className="bg-[#FDFBD4] border border-[#BDB76B]/30 px-3 py-1 rounded-full">ID: {product.id.slice(0, 8)}</span>
            <span className={`px-3 py-1 rounded-full font-black ${selected.stock > 0 ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-600 border border-red-200"}`}>{selected.stock > 0 ? `متوفر: ${selected.stock}` : "نفد المخزون"}</span>
          </div>
          <p className="text-zinc-600 mt-3 leading-relaxed">{product.description}</p>

          <div className="flex items-center gap-3 mt-4">
            <span className="flex items-center gap-1 bg-[#FDFBD4] border border-[#BDB76B] px-3 py-1.5 rounded-full text-sm font-bold">
              <IconStar className="h-4 w-4 text-[#D4AF37]" filled /> {product.rating}
            </span>
            <span className="text-sm text-zinc-500">({reviews.length} تقييم)</span>
            <span className="text-sm text-zinc-500">• {product.variants.length} خيارات</span>
          </div>

          <div className="bg-white border border-[#BDB76B]/20 rounded-2xl p-5 mt-6">
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="text-3xl font-black">{formatPrice(subPrice)}</span>
              {selected.compareAtPrice && <span className="line-through text-zinc-400">{formatPrice(selected.compareAtPrice)}</span>}
              {discount > 0 && <span className="bg-[#CE8946] text-white text-xs font-black px-2.5 py-1 rounded-full">-{discount}%</span>}
              {saving > 0 && <span className="bg-[#D4AF37] text-black text-xs font-black px-2.5 py-1 rounded-full">توفر {formatPrice(saving)}</span>}
            </div>
            <p className="text-xs text-zinc-500 mt-1">لـ: {selected.name} • {selected.stock > 0 ? `${selected.stock} متوفر` : "نفد المخزون"}</p>

            <div className="mt-5">
              <p className="text-sm font-black mb-2">اختر النكهة والحجم:</p>
              <div className="grid grid-cols-1 gap-2">
                {product.variants.map(v => {
                  const isSelected = v.id === selectedId
                  const subPriceV = product.isSubscription && isSub ? Math.round(v.price * (1 - product.subscriptionDiscount / 100)) : v.price
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedId(v.id)}
                      disabled={v.stock === 0}
                      className={`flex items-center justify-between p-3 rounded-xl border-2 text-right transition ${isSelected ? "border-[#D4AF37] bg-[#FDFBD4]" : "border-[#BDB76B]/20 bg-white hover:border-[#D4AF37]/50"} ${v.stock === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <div>
                        <p className="text-sm font-black">{v.name}</p>
                        <p className="text-xs text-zinc-500">{Object.values(v.attributes).join(" • ")} • {v.sku}</p>
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-black">{formatPrice(subPriceV)}</p>
                        {v.compareAtPrice && <p className="text-xs line-through text-zinc-400">{formatPrice(v.compareAtPrice)}</p>}
                        <p className={`text-xs font-bold ${v.stock > 5 ? "text-emerald-600" : v.stock > 0 ? "text-amber-600" : "text-red-600"}`}>{v.stock > 0 ? `متوفر` : "نفد"}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {product.isSubscription ? (
              <div className={`mt-5 rounded-xl p-4 border-2 transition ${isSub ? "border-[#D4AF37] bg-[#FDFBD4]" : "border-[#BDB76B]/20 bg-white"}`}>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={isSub} onChange={e => setIsSub(e.target.checked)} className="mt-1 h-5 w-5 accent-[#D4AF37]" />
                  <div className="flex-1">
                    <p className="text-sm font-black flex items-center gap-2">
                      Subscribe & Save
                      <span className="bg-[#D4AF37] text-black text-xs px-2 py-0.5 rounded-full">خصم {product.subscriptionDiscount}%</span>
                    </p>
                    <p className="text-xs text-zinc-600 mt-1">يتم التوصيل تلقائياً كل 30 يوم. وفر {formatPrice(Math.round(selected.price * product.subscriptionDiscount / 100))} في كل طلب.</p>
                    {isSub && <p className="text-xs font-black text-[#CE8946] mt-2">سعر الاشتراك: {formatPrice(subPrice)} بدلاً من {formatPrice(selected.price)}</p>}
                  </div>
                </label>
              </div>
            ) : (
              <p className="text-xs text-zinc-500 mt-4 bg-[#FDFBD4] border border-[#BDB76B]/20 rounded-xl p-3">هذا المنتج لا يدعم الاشتراك الشهري.</p>
            )}

            <div className="flex gap-3 mt-6">
              <div className="flex items-center border border-[#BDB76B]/30 rounded-full overflow-hidden bg-white">
                <button type="button" onClick={() => setQty(q => Math.max(1, q - 1))} className="h-12 w-12 hover:bg-[#FDFBD4] font-black active:bg-[#D4AF37]/20">−</button>
                <span className="w-12 text-center font-black select-none">{qty}</span>
                <button type="button" onClick={() => setQty(q => selected.stock === 0 ? q : Math.min(selected.stock, q + 1))} disabled={qty >= selected.stock || selected.stock === 0} className="h-12 w-12 hover:bg-[#FDFBD4] font-black disabled:opacity-30 active:bg-[#D4AF37]/20">+</button>
              </div>
              <button
                onClick={handleAdd}
                disabled={selected.stock === 0}
                className="flex-1 bg-[#D4AF37] text-black rounded-full font-black hover:bg-[#BDB76B] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {selected.stock === 0 ? "نفد المخزون" : `إضافة للسلة • ${formatPrice(subPrice * qty)}`}
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                handleAdd()
                setTimeout(() => router.push("/checkout"), 300)
              }}
              className="w-full mt-3 border-2 border-[#1a1a1a] text-[#1a1a1a] py-3 rounded-full font-black hover:bg-[#1a1a1a] hover:text-white transition"
            >
              اطلب الآن بضغطة واحدة
            </button>
            <p className="text-xs text-zinc-500 text-center mt-3">✓ شحن مجاني فوق 10000 دج • ✓ دفع عند الاستلام • ✓ إرجاع 14 يوم</p>
          </div>

          <div className="mt-8">
            <h3 className="font-black text-lg">التقييمات ({reviews.length})</h3>
            <form onSubmit={handleAddReview} className="bg-white border border-[#BDB76B]/20 rounded-2xl p-4 mt-4">
              <p className="text-sm font-black">أضف تقييمك</p>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="اسمك" maxLength={40} aria-label="اسمك" className="border border-[#BDB76B]/30 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37]" required />
                <select value={newRating} onChange={e => setNewRating(Number(e.target.value))} aria-label="التقييم" className="border border-[#BDB76B]/30 rounded-xl px-3 py-2 text-sm">
                  <option value={5}>★★★★★ (5)</option>
                  <option value={4}>★★★★ (4)</option>
                  <option value={3}>★★★ (3)</option>
                  <option value={2}>★★ (2)</option>
                  <option value={1}>★ (1)</option>
                </select>
              </div>
              <textarea value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="تعليقك..." maxLength={500} aria-label="تعليقك" className="w-full border border-[#BDB76B]/30 rounded-xl px-3 py-2 text-sm mt-3 focus:outline-none focus:border-[#D4AF37]" rows={3} required />
              <button type="submit" className="mt-3 bg-[#1a1a1a] text-white px-6 py-2 rounded-full text-sm font-black">نشر التقييم</button>
            </form>

            <div className="space-y-3 mt-4">
              {reviews.length === 0 ? <p className="text-sm text-zinc-500">لا توجد تقييمات بعد - كن أول من يقيم!</p> :
                reviews.map(r => (
                  <div key={r.id} className="bg-white border border-[#BDB76B]/20 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-sm">{r.userName}</span>
                      <span className="text-[#D4AF37] text-sm">{"★".repeat(r.rating)}<span className="text-zinc-300">{"★".repeat(5 - r.rating)}</span></span>
                    </div>
                    <p className="text-sm mt-1 text-zinc-700">{r.comment}</p>
                    <p className="text-xs text-zinc-400 mt-1">{new Date(r.createdAt).toLocaleDateString("ar-EG")}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}