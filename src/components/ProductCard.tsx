"use client"
import Link from "next/link"
import { useState } from "react"
import { Product } from "@/types"
import { formatPrice, calcDiscount } from "@/lib/utils"
import { IconStar, IconCart, IconHeart } from "@/components/Icons"
import { addToCartDirect } from "@/store/cart"
import { useWishlist } from "@/store/wishlist"

export function ProductCard({ product }: { product: Product }) {
  const defaultVariant = product.variants.find(v => v.isDefault) || product.variants[0]
  const discount = calcDiscount(defaultVariant.price, defaultVariant.compareAtPrice)
  const outOfStock = product.variants.every(v => v.stock === 0)
  const [added, setAdded] = useState(false)
  const { toggle, has } = useWishlist()
  const wished = has(product.id)

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (outOfStock || defaultVariant.stock === 0) return
    addToCartDirect({
      productId: product.id,
      variantId: defaultVariant.id,
      name: product.name,
      variantName: defaultVariant.name,
      image: product.images[0],
      price: defaultVariant.price,
      quantity: 1,
      isSubscription: false,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className="group relative rounded-2xl border border-[#BDB76B]/20 bg-white overflow-hidden hover:shadow-lg hover:border-[#D4AF37]/40 transition h-full flex flex-col">
      <div className="relative aspect-square bg-[#FDFBD4]/50 overflow-hidden">
        <Link href={`/products/${product.slug}`} className="block w-full h-full">
          <img src={product.images[0]} alt={product.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
        </Link>
        <button
          type="button"
          aria-label={wished ? "إزالة من المفضلة" : "إضافة للمفضلة"}
          aria-pressed={wished}
          onClick={() => toggle(product.id)}
          className={`absolute top-3 left-3 h-8 w-8 rounded-full flex items-center justify-center border backdrop-blur ${wished ? "bg-[#D4AF37] border-[#D4AF37] text-black" : "bg-white/90 border-[#BDB76B]/20 text-zinc-400 hover:text-[#CE8946]"}`}
        >
          <IconHeart className="h-4 w-4" aria-hidden="true" />
        </button>
          <div className="absolute top-3 left-12 flex flex-col gap-1.5">
            {discount > 0 && (
              <span className="bg-[#CE8946] text-white text-xs font-black px-2.5 py-1 rounded-full">
                -{discount}%
              </span>
            )}
            {outOfStock && (
              <span className="bg-[#1a1a1a] text-white text-xs font-black px-2.5 py-1 rounded-full">نفد المخزون</span>
            )}
          </div>
          {product.isSubscription && (
            <span className="absolute top-3 right-3 bg-[#D4AF37] text-black text-[11px] font-black px-2.5 py-1 rounded-full">
              وفر {product.subscriptionDiscount}%
            </span>
          )}
          <span className="absolute bottom-3 right-3 bg-white/95 backdrop-blur text-xs font-bold px-2.5 py-1 rounded-full border border-[#BDB76B]/20">
            {product.category.name}
          </span>
        </div>
        <Link href={`/products/${product.slug}`} className="block p-4 pb-2 hover:bg-[#FDFBD4]/30">
          <p className="text-xs text-zinc-500 font-bold tracking-wide">{product.brand}</p>
          <h3 className="product-title line-clamp-1 mt-0.5">{product.name}</h3>
          <p className="badge-text text-zinc-500 line-clamp-1">{product.shortDesc}</p>
          <div className="flex items-center gap-1.5 mt-2">
            <IconStar className="h-3.5 w-3.5 text-[#D4AF37]" filled aria-hidden="true" />
            <span className="text-sm font-bold">{product.rating}</span>
            <span className="text-xs text-zinc-400">({product.reviewCount})</span>
            <span className="mr-auto text-xs text-zinc-500 bg-[#FDFBD4] border border-[#BDB76B]/20 px-2 py-0.5 rounded-full">{product.variants.length} خيارات</span>
          </div>
          <div className="flex items-baseline gap-2 mt-3">
            <span className="price text-[#1a1a1a]">{formatPrice(defaultVariant.price)}</span>
            {defaultVariant.compareAtPrice && (
              <span className="text-sm text-zinc-400 line-through">{formatPrice(defaultVariant.compareAtPrice)}</span>
            )}
          </div>
          <p className="text-xs text-zinc-500 mt-1 line-clamp-1">
            {Object.values(defaultVariant.attributes).join(" • ")} {product.variants.length > 1 && `+${product.variants.length - 1}`} • <span className="font-mono font-bold">{defaultVariant.sku}</span>
          </p>
          <p className="text-[11px] text-zinc-400 font-mono">CODE: {defaultVariant.sku} • {product.slug}</p>
        </Link>

      <div className="p-4 pt-2 mt-auto">
        <button
          onClick={handleAdd}
          disabled={outOfStock || defaultVariant.stock === 0}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-full text-xs font-black transition ${
            outOfStock || defaultVariant.stock === 0
              ? "bg-zinc-100 text-zinc-400 cursor-not-allowed border border-zinc-200"
              : added
              ? "bg-emerald-500 text-white"
              : "bg-[#1a1a1a] text-white hover:bg-[#D4AF37] hover:text-black"
          }`}
        >
          <IconCart className="h-4 w-4" />
          {outOfStock ? "نفد المخزون" : added ? "تمت الإضافة ✓" : "أضف للسلة"}
        </button>
        <Link href={`/products/${product.slug}`} className="block text-center text-xs font-bold text-[#CE8946] hover:underline mt-2">
          عرض التفاصيل
        </Link>
      </div>
    </div>
  )
}