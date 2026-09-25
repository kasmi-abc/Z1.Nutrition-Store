"use client"
import Link from "next/link"
import { useWishlist } from "@/store/wishlist"
import { useProducts } from "@/hooks/useProducts"
import { ProductCard } from "@/components/ProductCard"

export default function WishlistPage() {
  const { ids } = useWishlist()
  const products = useProducts()
  const wished = products.filter(p => ids.includes(p.id))

  if (wished.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-black">المفضلة</h1>
        <p className="text-sm text-zinc-500 mt-2">لم تضف أي منتج للمفضلة بعد - اضغط على القلب في أي كارد</p>
        <Link href="/products" className="inline-block mt-6 bg-[#D4AF37] text-black px-8 py-3 rounded-full font-black">تصفح المنتجات</Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-black">المفضلة ({wished.length})</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {wished.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  )
}