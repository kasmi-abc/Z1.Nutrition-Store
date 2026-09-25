"use client"
import Link from "next/link"
import { useCartStore } from "@/store/cart"
import { formatPrice } from "@/lib/utils"
import { IconTruck, IconCart } from "@/components/Icons"
import { useProducts } from "@/hooks/useProducts"

export default function CartPage() {
  const { items, updateQuantity, removeItem, total, clearCart } = useCartStore()
  const t = total()
  const shipping = t >= 10000 ? 0 : 500
  const grand = t + shipping
  const remaining = 10000 - t
  const allProducts = useProducts()
  const getStock = (variantId: string) => {
    for (const p of allProducts) {
      const v = p.variants.find(v => v.id === variantId)
      if (v) return v.stock
    }
    return 99
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <div className="h-20 w-20 mx-auto rounded-full bg-[#FDFBD4] border-2 border-[#BDB76B] flex items-center justify-center"><IconCart className="h-8 w-8 text-[#CE8946]" /></div>
        <h1 className="text-2xl font-black mt-4">سلتك فارغة</h1>
        <p className="text-zinc-500 mt-2">ابدأ التسوق واختر نكهتك المفضلة</p>
        <Link href="/products" className="inline-block mt-6 bg-[#D4AF37] text-black px-8 py-3 rounded-full font-black">تسوق الآن</Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-black">سلتك ({items.length})</h1>

      {remaining > 0 && remaining < 10000 && (
        <div className="mt-4 bg-[#1a1a1a] text-white rounded-full px-4 py-2 text-sm flex items-center gap-2">
          <IconTruck className="h-4 w-4 text-[#D4AF37]" />
          أضف منتجات بقيمة {formatPrice(remaining)} للحصول على شحن مجاني
          <div className="mr-auto h-2 w-32 bg-white/20 rounded-full overflow-hidden hidden sm:block">
            <div className="h-full bg-[#D4AF37]" style={{ width: `${Math.min(100, (t / 10000) * 100)}%` }} />
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-[1fr_380px] gap-8 mt-6">
        <div className="space-y-3">
          {items.map(item => (
            <div key={`${item.variantId}-${item.isSubscription}`} className="bg-white border border-[#BDB76B]/20 rounded-2xl p-4 flex gap-4">
              <img src={item.image} alt={item.name} className="h-20 w-20 rounded-xl object-cover border border-[#BDB76B]/10" />
              <div className="flex-1">
                <p className="font-black text-sm">{item.name}</p>
                <p className="text-xs text-zinc-500">{item.variantName} {item.isSubscription && <span className="bg-[#D4AF37] text-black px-1.5 py-0.5 rounded-full text-[10px]">اشتراك</span>}</p>
                <p className="text-sm font-black mt-1 text-[#CE8946]">{formatPrice(item.price)} × {item.quantity} = {formatPrice(item.price * item.quantity)}</p>
                <div className="flex gap-2 mt-3">
                  <div className="flex items-center border border-[#BDB76B]/30 rounded-full overflow-hidden h-8 bg-white">
                    <button type="button" onClick={() => updateQuantity(item.variantId, item.quantity - 1, item.isSubscription)} className="h-8 w-8 hover:bg-[#FDFBD4] font-black active:bg-[#D4AF37]/20">−</button>
                    <span className="w-8 text-center text-sm font-black">{item.quantity}</span>
                    <button type="button" onClick={() => { const s = getStock(item.variantId); if (item.quantity < s) updateQuantity(item.variantId, item.quantity + 1, item.isSubscription) }} disabled={item.quantity >= getStock(item.variantId)} className="h-8 w-8 hover:bg-[#FDFBD4] font-black disabled:opacity-30 active:bg-[#D4AF37]/20">+</button>
                  </div>
                  <button type="button" onClick={() => removeItem(item.variantId, item.isSubscription)} className="text-xs font-bold underline text-red-600">حذف</button>
                  {item.isSubscription && <span className="text-xs text-emerald-600 font-bold">✓ توفير {formatPrice(Math.round(item.price * 0.15))}</span>}
                </div>
              </div>
            </div>
          ))}
          <button type="button" onClick={clearCart} className="text-sm font-bold underline text-zinc-500">مسح السلة</button>

          <div className="bg-white border border-[#BDB76B]/20 rounded-2xl p-4 mt-4">
            <p className="font-black text-sm">هل تريد إضافة شيكر أو كرياتين مع طلبك بسعر مخفض؟</p>
            <p className="text-xs text-zinc-500">اقتراح Cross-sell يظهر عند الإضافة للسلة - يزيد متوسط قيمة الطلب</p>
            <Link href="/products?category=creatine" className="inline-block mt-3 bg-[#FDFBD4] border border-[#BDB76B] px-4 py-2 rounded-full text-xs font-black">إضافة كرياتين</Link>
          </div>
        </div>

        <div className="bg-white border border-[#BDB76B]/20 rounded-2xl p-6 h-fit sticky top-24">
          <h3 className="font-black">ملخص الطلب</h3>
          <div className="flex justify-between mt-4 text-sm">
            <span>المجموع</span><span className="font-bold">{formatPrice(t)}</span>
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <span>الشحن</span><span className={shipping === 0 ? "text-emerald-600 font-black" : "font-bold"}>{shipping === 0 ? "مجاني" : formatPrice(shipping)}</span>
          </div>
          {shipping === 0 && <p className="text-xs text-emerald-600 font-bold mt-1">✓ شحن مجاني لتجاوزك 10000 دج</p>}
          <div className="flex justify-between mt-4 text-lg font-black border-t border-[#BDB76B]/20 pt-4">
            <span>الإجمالي</span><span className="text-[#CE8946]">{formatPrice(grand)}</span>
          </div>
          <Link href="/checkout" className="block text-center bg-[#D4AF37] text-black py-3.5 rounded-full font-black mt-6 hover:bg-[#BDB76B]">متابعة الشراء</Link>
          <p className="text-xs text-zinc-500 text-center mt-2">✓ دفع عند الاستلام ✓ إرجاع 14 يوم ✓ منتج أصلي</p>
          <div className="mt-4 bg-[#FDFBD4] border border-[#BDB76B]/20 rounded-xl p-3 text-xs">
            <p className="font-black">كود الخصم FIT10</p>
            <p className="text-zinc-600">استخدمه في الملاحظات عند التأكيد لتوفير 10%</p>
          </div>
        </div>
      </div>
    </div>
  )
}