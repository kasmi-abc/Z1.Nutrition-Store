"use client"
import { useEffect, useState } from "react"
import { ProductDetailClient } from "@/components/ProductDetailClient"
import type { Product } from "@/types"

export function AdminProductLoader({ slug }: { slug: string }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const saved = localStorage.getItem("z1-admin-products")
      if (saved) {
        const list: Product[] = JSON.parse(saved)
        const found = list.find(p => p.slug === slug)
        if (found) setProduct(found)
      }
    } catch {}
    setLoading(false)
  }, [slug])

  if (loading) return <div className="text-center py-16 text-sm">جاري التحميل...</div>
  if (!product) return <div className="text-center py-16"><p className="font-black">المنتج غير موجود</p><p className="text-sm text-zinc-500">تأكد من الرابط أو أنه أضيف من الأدمن</p></div>

  return <ProductDetailClient product={product} />
}