import Link from "next/link"
import { Suspense } from "react"
import { ProductsClient } from "@/components/ProductsClient"

export default function ProductsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <p className="text-sm text-zinc-500">
        <Link href="/" className="hover:underline">الرئيسية</Link> <span className="mx-1">›</span> <span className="text-black font-bold">المتجر</span>
      </p>
      <Suspense fallback={<div className="py-16 text-center text-sm">جاري التحميل...</div>}>
        <ProductsClient />
      </Suspense>
    </div>
  )
}