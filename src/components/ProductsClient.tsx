"use client"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { categories } from "@/data/products"
import { useProducts } from "@/hooks/useProducts"
import { ProductCard } from "@/components/ProductCard"
import { IconSearch, IconStar } from "@/components/Icons"

function buildUrl(params: Record<string, string | undefined>, overrides: Record<string, string | undefined>) {
  const next = { ...params, ...overrides }
  Object.keys(next).forEach(k => {
    const v = (next as any)[k]
    if (!v || v === "all") delete (next as any)[k]
  })
  const qs = new URLSearchParams(next as any).toString()
  return qs ? `/products?${qs}` : "/products"
}

export function ProductsClient() {
  const searchParams = useSearchParams()
  const allProducts = useProducts()

  const goal = searchParams.get("goal") || undefined
  const category = searchParams.get("category") || undefined
  const brand = searchParams.get("brand") || undefined
  const flavor = searchParams.get("flavor") || undefined
  const q = searchParams.get("q") || undefined
  const maxPrice = searchParams.get("maxPrice") || undefined
  const sort = searchParams.get("sort") || undefined
  const page = Math.max(1, Number(searchParams.get("page") || 1))

  const currentParams: Record<string, string | undefined> = { goal, category, brand, flavor, q, maxPrice, sort, page: page !== 1 ? String(page) : undefined }

  const allBrands = Array.from(new Set(allProducts.map(p => p.brand)))
  const allFlavors = Array.from(new Set(allProducts.flatMap(p => p.variants.map(v => v.attributes.flavor).filter(Boolean) as string[])))

  let filtered = [...allProducts]

  if (q) {
    const term = q.toLowerCase()
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.brand.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term)
    )
  }

  if (goal && goal !== "all") filtered = filtered.filter(p => p.goal === goal)
  if (category && category !== "all") filtered = filtered.filter(p => p.category.slug === category)
  if (brand && brand !== "all") filtered = filtered.filter(p => p.brand === brand)
  if (flavor && flavor !== "all") filtered = filtered.filter(p => p.variants.some(v => v.attributes.flavor === flavor))
  if (maxPrice) {
    const max = Number(maxPrice)
    filtered = filtered.filter(p => {
      const price = (p.variants.find(v => v.isDefault) || p.variants[0]).price
      return price <= max
    })
  }

  if (sort === "price-asc") filtered.sort((a, b) => (a.variants[0].price - b.variants[0].price))
  if (sort === "price-desc") filtered.sort((a, b) => (b.variants[0].price - a.variants[0].price))
  if (sort === "rating") filtered.sort((a, b) => b.rating - a.rating)

  const activeCount = [goal, category, brand, flavor, q, maxPrice].filter(Boolean).length

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black">كتالوج المنتجات</h1>
          <p className="text-sm text-zinc-600 mt-1">تصفية دقيقة حسب الهدف، العلامة، النكهة والسعر (دج)</p>
        </div>

        <form action="/products" method="GET" className="flex gap-2 bg-white border border-[#BDB76B]/30 rounded-full p-1">
          {goal && <input type="hidden" name="goal" value={goal} />}
          {category && <input type="hidden" name="category" value={category} />}
          {brand && <input type="hidden" name="brand" value={brand} />}
          {flavor && <input type="hidden" name="flavor" value={flavor} />}
          {maxPrice && <input type="hidden" name="maxPrice" value={maxPrice} />}
          {sort && <input type="hidden" name="sort" value={sort} />}
          <input
            name="q"
            defaultValue={q}
            placeholder="ابحث بالماركة أو المنتج..."
            className="bg-transparent px-4 py-2 text-sm w-56 focus:outline-none"
          />
          <button type="submit" className="bg-[#D4AF37] text-black px-6 py-2 rounded-full text-sm font-black flex items-center gap-1">
            <IconSearch className="h-4 w-4" /> بحث
          </button>
        </form>
      </div>

      <div className="grid lg:grid-cols-[300px_1fr] gap-8 mt-8">
        <aside className="space-y-4">
          <div className="bg-white border border-[#BDB76B]/20 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-black flex items-center gap-2">الفلاتر <span className="bg-[#FDFBD4] border border-[#BDB76B]/30 px-2 py-0.5 rounded-full text-xs">{activeCount}</span></h3>
              {activeCount > 0 && <Link href="/products" className="text-xs font-bold text-[#CE8946] underline">مسح الكل</Link>}
            </div>

            <div className="mt-5">
              <p className="text-sm font-black mb-2 flex items-center gap-2"><span className="h-1 w-6 bg-[#D4AF37] rounded-full" /> حسب الهدف</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "الكل", value: "all" },
                  { label: "ضخامة", value: "MUSCLE_GAIN" },
                  { label: "تنشيف", value: "WEIGHT_LOSS" },
                  { label: "طاقة", value: "ENERGY" },
                  { label: "صحة", value: "GENERAL" },
                ].map(f => {
                  const active = (goal || "all") === f.value
                  return (
                    <Link
                      key={f.label}
                      href={buildUrl(currentParams, { goal: f.value })}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border ${active ? "bg-[#1a1a1a] text-white border-[#1a1a1a]" : "bg-white border-[#BDB76B]/30 hover:border-[#D4AF37]"}`}
                    >
                      {f.label}
                    </Link>
                  )
                })}
              </div>
            </div>

            <div className="mt-5">
              <p className="text-sm font-black mb-2">حسب النوع</p>
              <div className="space-y-1">
                <Link href={buildUrl(currentParams, { category: "all" })} className={`block px-3 py-2 rounded-xl text-sm font-bold flex justify-between ${!category || category === "all" ? "bg-[#1a1a1a] text-white" : "hover:bg-[#FDFBD4] border border-transparent hover:border-[#BDB76B]/20"}`}>الكل <span>{allProducts.length}</span></Link>
                {categories.map(c => {
                  const active = category === c.slug
                  const count = allProducts.filter(p => p.category.slug === c.slug).length
                  return (
                    <Link
                      key={c.id}
                      href={buildUrl(currentParams, { category: c.slug })}
                      className={`block px-3 py-2 rounded-xl text-sm font-bold flex justify-between ${active ? "bg-[#D4AF37] text-black" : "hover:bg-[#FDFBD4]"}`}
                    >
                      <span>{c.name}</span><span className="text-xs opacity-60">{count}</span>
                    </Link>
                  )
                })}
              </div>
            </div>

            <div className="mt-5">
              <p className="text-sm font-black mb-2">العلامة التجارية</p>
              <div className="space-y-1 max-h-32 overflow-auto">
                <Link href={buildUrl(currentParams, { brand: "all" })} className={`block px-3 py-1.5 rounded-xl text-xs font-bold ${!brand || brand === "all" ? "bg-[#1a1a1a] text-white" : "hover:bg-[#FDFBD4]"}`}>الكل</Link>
                {allBrands.map(b => (
                  <Link
                    key={b}
                    href={buildUrl(currentParams, { brand: b })}
                    className={`block px-3 py-1.5 rounded-xl text-xs font-bold ${brand === b ? "bg-[#D4AF37] text-black" : "hover:bg-[#FDFBD4]"}`}
                  >
                    {b}
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <p className="text-sm font-black mb-2">النكهة</p>
              <div className="flex flex-wrap gap-1.5">
                <Link href={buildUrl(currentParams, { flavor: "all" })} className={`px-2.5 py-1 rounded-full text-xs font-bold border ${!flavor || flavor === "all" ? "bg-[#1a1a1a] text-white border-black" : "bg-white border-[#BDB76B]/30"}`}>الكل</Link>
                {allFlavors.map(f => (
                  <Link key={f} href={buildUrl(currentParams, { flavor: f })} className={`px-2.5 py-1 rounded-full text-xs font-bold border ${flavor === f ? "bg-[#CE8946] text-white border-[#CE8946]" : "bg-white border-[#BDB76B]/30"}`}>
                    {f}
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <p className="text-sm font-black mb-2">حسب السعر (دج)</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "الكل", value: undefined },
                  { label: "≤ 7,000", value: "7000" },
                  { label: "≤ 10,000", value: "10000" },
                  { label: "≤ 15,000", value: "15000" },
                  { label: "≤ 20,000", value: "20000" },
                  { label: "≤ 30,000", value: "30000" },
                ].map(p => (
                  <Link
                    key={p.label}
                    href={buildUrl(currentParams, { maxPrice: p.value })}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border ${maxPrice === p.value ? "bg-[#D4AF37] text-black border-[#D4AF37]" : !maxPrice && !p.value ? "bg-[#1a1a1a] text-white" : "bg-white border-[#BDB76B]/30"}`}
                  >
                    {p.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-5 border-t border-[#BDB76B]/20">
              <p className="text-sm font-black mb-2">ترتيب</p>
              <div className="space-y-1">
                {[
                  { label: "افتراضي", value: undefined },
                  { label: "السعر: الأقل أولاً", value: "price-asc" },
                  { label: "السعر: الأعلى أولاً", value: "price-desc" },
                  { label: "الأعلى تقييماً", value: "rating" },
                ].map(s => (
                  <Link
                    key={s.label}
                    href={buildUrl(currentParams, { sort: s.value })}
                    className={`block px-3 py-2 rounded-xl text-xs font-bold ${sort === s.value ? "bg-[#1a1a1a] text-white" : !sort && !s.value ? "bg-[#1a1a1a] text-white" : "hover:bg-[#FDFBD4]"}`}
                  >
                    {s.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <div>
          <div className="flex items-center justify-between bg-white border border-[#BDB76B]/20 rounded-full px-4 py-2">
            <span className="text-sm font-bold">{filtered.length} منتج</span>
            <span className="text-xs text-zinc-500 flex items-center gap-1"><IconStar className="h-3 w-3 text-[#D4AF37]" filled /> منتجات أصلية • توصيل 58 ولاية</span>
          </div>

          {(() => {
            const PAGE_SIZE = 12
            const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
            const curPage = Math.min(page, totalPages)
            const paginated = filtered.slice((curPage - 1) * PAGE_SIZE, curPage * PAGE_SIZE)
            if (filtered.length === 0) return (
              <div className="bg-white border border-[#BDB76B]/20 rounded-2xl p-12 text-center mt-6">
                <div className="h-12 w-12 mx-auto rounded-full bg-[#FDFBD4] border border-[#BDB76B] flex items-center justify-center"><IconSearch className="h-5 w-5" /></div>
                <p className="font-black mt-3">لا توجد منتجات</p>
                <p className="text-sm text-zinc-500 mt-1">جرب تغيير الفلاتر</p>
                <Link href="/products" className="inline-block mt-4 bg-[#D4AF37] text-black px-6 py-2 rounded-full text-sm font-black">مسح الفلاتر</Link>
              </div>
            )
            return (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
                  {paginated.map(p => <ProductCard key={p.id} product={p} />)}
                </div>
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <Link href={buildUrl(currentParams, { page: String(Math.max(1, curPage - 1)) })} className={`px-4 py-2 rounded-full text-xs font-black border ${curPage === 1 ? "opacity-30 pointer-events-none" : "bg-white hover:bg-[#FDFBD4]"}`}>السابق</Link>
                    <span className="text-xs font-bold bg-[#1a1a1a] text-white px-3 py-1 rounded-full">{curPage} / {totalPages}</span>
                    <Link href={buildUrl(currentParams, { page: String(Math.min(totalPages, curPage + 1)) })} className={`px-4 py-2 rounded-full text-xs font-black border ${curPage === totalPages ? "opacity-30 pointer-events-none" : "bg-white hover:bg-[#FDFBD4]"}`}>التالي</Link>
                  </div>
                )}
              </>
            )
          })()}
        </div>
      </div>
    </div>
  )
}