import { products } from "@/data/products"
import Link from "next/link"
import { ProductDetailClient } from "@/components/ProductDetailClient"
import { AdminProductLoader } from "@/components/AdminProductLoader"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const p = products.find(pr => pr.slug === slug)
  if (!p) return { title: slug }
  return {
    title: `${p.name} - ${p.brand}`,
    description: p.shortDesc || p.description.slice(0, 150),
    openGraph: { title: p.name, description: p.description.slice(0, 150), images: [p.images[0]] },
  }
}

export function generateStaticParams() {
  return products.map(p => ({ slug: p.slug }))
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = products.find(p => p.slug === slug)
  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <nav className="text-sm text-zinc-500 flex gap-2">
          <Link href="/" className="hover:underline">الرئيسية</Link>
          <span>›</span>
          <Link href="/products" className="hover:underline">المنتجات</Link>
          <span>›</span>
          <span className="text-black font-medium">{slug}</span>
        </nav>
        <div className="mt-6">
          <AdminProductLoader slug={slug} />
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <nav className="text-sm text-zinc-500 flex gap-2">
        <Link href="/" className="hover:underline">الرئيسية</Link>
        <span>›</span>
        <Link href="/products" className="hover:underline">المنتجات</Link>
        <span>›</span>
        <span className="text-black font-medium">{product.name}</span>
      </nav>

      <div className="mt-6">
        <ProductDetailClient product={product} />
      </div>

      {/* Related */}
      <div className="mt-12 border-t pt-8">
        <h3 className="font-bold">منتجات مشابهة</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {products.filter(p => p.category.slug === product.category.slug && p.id !== product.id).slice(0,4).map(p=>(
            <Link key={p.id} href={`/products/${p.slug}`} className="bg-white border rounded-2xl p-3 hover:shadow">
              <img src={p.images[0]} alt={p.name} className="rounded-xl aspect-square object-cover w-full" />
              <p className="font-semibold text-sm mt-2 line-clamp-1">{p.name}</p>
              <p className="text-xs text-zinc-500">{p.brand}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}