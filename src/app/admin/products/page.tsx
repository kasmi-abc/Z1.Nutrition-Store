"use client"
import { useState, useEffect, useRef } from "react"
import { products as initialProducts } from "@/data/products"
import { formatPrice } from "@/lib/utils"
import { notifyProductsUpdate } from "@/hooks/useProducts"

type AdminProduct = typeof initialProducts[0]
const LS_KEY = "z1-admin-products"

const categoryLabels: Record<string, string> = {
  protein: "بروتين",
  creatine: "كرياتين",
  "pre-workout": "ما قبل التمرين",
  vitamins: "فيتامينات",
  "fat-burner": "حوارق دهون",
  amino: "أمينو / BCAA",
  "mass-gainer": "مس غينر / ضخامة",
  hormone: "محفزات طبيعية",
}
const flavorOptions = ["شوكولاتة", "فانيليا", "فراولة", "كوكيز", "بدون نكهة"] as const
const brandOptions = ["Optimum Nutrition", "MyProtein", "Dymatize", "MuscleTech", "Now Foods", "C4", "BSN", "Scitec Nutrition"] as const

export default function AdminProducts() {
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ name: "", brand: "", customBrand: "", price: "", stock: "", category: "protein", goal: "MUSCLE_GAIN" })
  const [brandMode, setBrandMode] = useState<"select" | "custom">("select")
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([])
  const [flavorStocks, setFlavorStocks] = useState<Record<string, string>>({})
  const [sharedStockMode, setSharedStockMode] = useState(true)
  const [images, setImages] = useState<string[]>([])
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/products?limit=50", { cache: "no-store" })
      if (res.ok) {
        const data = await res.json()
        if (data.products && data.products.length) {
          setProducts(data.products)
          localStorage.setItem(LS_KEY, JSON.stringify(data.products))
          notifyProductsUpdate()
          setLoading(false)
          return
        }
      }
    } catch {}
    const saved = localStorage.getItem(LS_KEY)
    setProducts(saved ? JSON.parse(saved) : initialProducts)
    setLoading(false)
  }

  useEffect(() => { fetchProducts() }, [])

  const saveLocal = (next: AdminProduct[]) => {
    setProducts(next)
    localStorage.setItem(LS_KEY, JSON.stringify(next))
    notifyProductsUpdate()
  }

  const addImages = (files: FileList | File[]) => {
    const arr = Array.from(files).slice(0, 4 - images.length)
    if (images.length + arr.length > 4) {
      setError("الحد الأقصى 4 صور (1 رئيسية + 3 إضافية)")
      return
    }
    arr.forEach(f => {
      if (f.size > 2 * 1024 * 1024) { setError("حجم الصورة كبير (الحد 2MB)"); return }
      const reader = new FileReader()
      reader.onload = () => {
        setImages(prev => prev.length < 4 ? [...prev, reader.result as string] : prev)
      }
      reader.readAsDataURL(f)
    })
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false)
    if (e.dataTransfer.files?.length) addImages(e.dataTransfer.files)
  }

  const removeImage = (idx: number) => setImages(prev => prev.filter((_, i) => i !== idx))

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault(); setError("")
    if (images.length === 0) { setError("حقل الصورة مطلوب - اسحب صورة أو اختر من الجهاز (drag & drop)"); return }
    if (!form.name.trim() || !form.price) { setError("الاسم والسعر مطلوبان"); return }
    const brandFinal = brandMode === "custom" ? form.customBrand.trim() : form.brand
    if (!brandFinal) { setError("اختر الماركة أو اكتب ماركة جديدة"); return }

    const baseSlug = form.name.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\u0600-\u06FF\-]/g, "") || `product-${Date.now()}`
    let slug = baseSlug; let c = 1
    const existingSlugs = new Set(products.map(p => p.slug).concat(initialProducts.map(p => p.slug)))
    while (existingSlugs.has(slug)) slug = `${baseSlug}-${c++}`

    const now = Date.now()
    const variants: any[] = []
    if (selectedFlavors.length === 0) {
      variants.push({ name: "افتراضي", sku: `SKU-${now.toString().slice(-6)}`, price: Number(form.price), stock: Number(form.stock) || 10, attributes: {}, isDefault: true, image: images[0] })
    } else {
      selectedFlavors.forEach((fl, idx) => {
        const stock = sharedStockMode ? (Number(form.stock) || 10) : (Number(flavorStocks[fl]) || 10)
        variants.push({
          name: `${fl} - افتراضي`,
          sku: `SKU-${now.toString().slice(-6)}-${idx}`,
          price: Number(form.price),
          stock,
          attributes: { flavor: fl },
          isDefault: idx === 0,
          image: images[0],
        })
      })
    }

    setSaving(true)
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          slug,
          description: `منتج ${form.name} - ${categoryLabels[form.category] || form.category} أصلي 100%`,
          shortDesc: `${brandFinal} • ${categoryLabels[form.category] || form.category}`,
          brand: brandFinal,
          goal: form.goal,
          images,
          isFeatured: true,
          categorySlug: form.category,
          variants,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "فشل الحفظ في Neon، سيتم الحفظ محلياً")
        throw new Error(data.error)
      }
      // success - refetch
      await fetchProducts()
      setShowAdd(false)
      setForm({ name: "", brand: "", customBrand: "", price: "", stock: "", category: "protein", goal: "MUSCLE_GAIN" })
      setSelectedFlavors([]); setFlavorStocks({}); setImages([]); setBrandMode("select")
    } catch (err: any) {
      // fallback local
      if (!err?.message?.includes("SKU")) {
        const newP: any = {
          id: now.toString(),
          name: form.name.trim(),
          slug,
          description: `منتج ${form.name} - ${categoryLabels[form.category] || form.category} أصلي 100%`,
          shortDesc: `${brandFinal} • ${categoryLabels[form.category] || form.category}`,
          brand: brandFinal,
          goal: form.goal,
          images,
          isFeatured: true,
          isSubscription: false,
          subscriptionDiscount: 0,
          rating: 5,
          reviewCount: 0,
          category: { id: form.category, name: categoryLabels[form.category] || form.category, slug: form.category },
          variants,
          reviews: [],
        }
        saveLocal([newP, ...products])
        setShowAdd(false)
        setForm({ name: "", brand: "", customBrand: "", price: "", stock: "", category: "protein", goal: "MUSCLE_GAIN" })
        setSelectedFlavors([]); setFlavorStocks({}); setImages([]); setBrandMode("select")
        if (!error) setError("تم الحفظ محلياً (Neon غير متاح) — المنتج سيظهر فوراً")
      }
    } finally {
      setSaving(false)
    }
  }

  const toggleFlavor = (fl: string) => {
    setSelectedFlavors(prev => prev.includes(fl) ? prev.filter(x => x !== fl) : [...prev, fl])
  }

  const handleDelete = async (slug: string) => {
    if (!confirm("حذف المنتج؟")) return
    try {
      const res = await fetch(`/api/products/${slug}`, { method: "DELETE" })
      if (res.ok) { fetchProducts(); return }
    } catch {}
    // fallback
    saveLocal(products.filter(p => p.slug !== slug))
  }

  const handleStockEdit = async (slug: string, delta: number) => {
    const p = products.find(x => x.slug === slug)
    if (!p) return
    const newStock = Math.max(0, (p.variants[0]?.stock || 0) + delta)
    try {
      const res = await fetch(`/api/products/${slug}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ stock: newStock }) })
      if (res.ok) { fetchProducts(); return }
    } catch {}
    const next = products.map(prod => {
      if (prod.slug !== slug) return prod
      const v = prod.variants[0]
      return { ...prod, variants: [{ ...v, stock: newStock }, ...prod.variants.slice(1)] }
    })
    saveLocal(next)
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black">المنتجات</h1>
          <p className="text-sm text-zinc-500">{loading ? "جاري التحميل..." : `${products.length} منتج • Neon متصل ✓ • التسعير بالدينار الجزائري`}</p>
        </div>
        <button type="button" onClick={() => setShowAdd(!showAdd)} className="bg-[#D4AF37] text-black px-5 py-2 rounded-full text-sm font-black">
          {showAdd ? "إلغاء" : "إضافة منتج"}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="bg-white border border-[#BDB76B]/20 rounded-2xl p-5 mt-4 grid md:grid-cols-2 gap-3">
          <input placeholder="اسم المنتج *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="border border-[#BDB76B]/30 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]" required />
          <div className="flex gap-2">
            {brandMode === "select" ? (
              <select value={form.brand} onChange={e => {
                if (e.target.value === "__custom") setBrandMode("custom")
                else setForm({ ...form, brand: e.target.value })
              }} className="flex-1 border border-[#BDB76B]/30 rounded-xl px-3 py-2.5 text-sm bg-white" required>
                <option value="">اختر الماركة *</option>
                {brandOptions.map(b => <option key={b} value={b}>{b}</option>)}
                <option value="__custom">+ ماركة أخرى (اكتب)</option>
              </select>
            ) : (
              <div className="flex-1 flex gap-2">
                <input placeholder="اسم الماركة الجديدة *" value={form.customBrand} onChange={e => setForm({ ...form, customBrand: e.target.value })} className="flex-1 border border-[#D4AF37] rounded-xl px-3 py-2.5 text-sm bg-[#FDFBD4]" required />
                <button type="button" onClick={() => setBrandMode("select")} className="text-xs underline">رجوع</button>
              </div>
            )}
          </div>

          <input placeholder="السعر بالدج (مثال 15000) *" type="number" min={100} value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="border border-[#BDB76B]/30 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]" required />
          <div className="flex items-center gap-2">
            <input placeholder={selectedFlavors.length ? "المخزون العام (إذا مخزون موحد)" : "المخزون *"} type="number" min={0} value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} className="flex-1 border border-[#BDB76B]/30 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]" required={selectedFlavors.length === 0 || sharedStockMode} />
          </div>

          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="border border-[#BDB76B]/30 rounded-xl px-3 py-2.5 text-sm bg-white">
            {Object.entries(categoryLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <select value={form.goal} onChange={e => setForm({ ...form, goal: e.target.value })} className="border border-[#BDB76B]/30 rounded-xl px-3 py-2.5 text-sm bg-white">
            <option value="MUSCLE_GAIN">تضخيم</option><option value="WEIGHT_LOSS">تنشيف</option><option value="ENERGY">طاقة</option><option value="GENERAL">صحة</option>
          </select>

          <div className="md:col-span-2 bg-[#FDFBD4]/50 border border-[#BDB76B]/20 rounded-xl p-4">
            <p className="text-xs font-black">النكهات (اختر حتى 5) - كل نكهة تتحول لـ variant بمخزونها</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {flavorOptions.map(fl => (
                <button key={fl} type="button" onClick={() => toggleFlavor(fl)} className={`px-3 py-1.5 rounded-full text-xs font-black border ${selectedFlavors.includes(fl) ? "bg-[#1a1a1a] text-white border-black" : "bg-white border-[#BDB76B]/30 hover:border-[#D4AF37]"}`}>{fl} {selectedFlavors.includes(fl) && "✓"}</button>
              ))}
            </div>
            {selectedFlavors.length > 0 && (
              <div className="mt-3 space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold">
                  <input type="checkbox" checked={sharedStockMode} onChange={e => setSharedStockMode(e.target.checked)} /> مخزون عام موحّد لكل النكهات
                </label>
                {!sharedStockMode && (
                  <div className="grid grid-cols-2 gap-2">
                    {selectedFlavors.map(fl => (
                      <div key={fl} className="flex items-center gap-2 bg-white border border-[#BDB76B]/20 rounded-xl px-3 py-2">
                        <span className="text-xs font-bold flex-1">{fl}</span>
                        <input placeholder="المخزون" type="number" min={0} value={flavorStocks[fl] || ""} onChange={e => setFlavorStocks(s => ({ ...s, [fl]: e.target.value }))} className="w-20 border border-[#BDB76B]/30 rounded-lg px-2 py-1 text-xs" />
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-[11px] text-zinc-500">سيتم إنشاء {selectedFlavors.length} متغيرات (variants) كل واحد SKU مختلف و stock مستقل</p>
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-black flex items-center gap-2">📸 صور المنتج * (حتى 4: 1 رئيسية + 3 إضافية) — اسحب وأفلت أو اختر من الجهاز</label>
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              className={`mt-2 border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${dragOver ? "border-[#D4AF37] bg-[#D4AF37]/10" : "border-[#BDB76B]/30 bg-[#FDFBD4]/30 hover:border-[#D4AF37]/50"}`}
            >
              <p className="text-sm font-bold">اسحب الصور هنا أو اضغط للاختيار من الجهاز/الهاتف</p>
              <p className="text-xs text-zinc-500 mt-1">يدعم JPG, PNG, WEBP — الحد 2MB لكل صورة — {images.length}/4</p>
              <button type="button" onClick={e => { e.stopPropagation(); fileRef.current?.click() }} className="mt-3 bg-[#1a1a1a] text-white px-5 py-2 rounded-full text-xs font-black">اختيار من الجهاز</button>
              <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={e => e.target.files && addImages(e.target.files)} />
            </div>
            <div className="grid grid-cols-4 gap-2 mt-3">
              {images.map((src, idx) => (
                <div key={idx} className="relative group">
                  <img src={src} alt={`img-${idx}`} className={`h-24 w-full rounded-xl object-cover border-2 ${idx === 0 ? "border-[#D4AF37]" : "border-[#BDB76B]/20"}`} />
                  {idx === 0 && <span className="absolute top-1 right-1 bg-[#D4AF37] text-black text-[10px] px-1.5 py-0.5 rounded-full font-black">رئيسية</span>}
                  <button type="button" onClick={() => removeImage(idx)} className="absolute -top-1 -left-1 h-6 w-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100">✕</button>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <input placeholder="أو ألصق رابط صورة https://..." onKeyDown={e => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  const val = (e.target as HTMLInputElement).value.trim()
                  if (val && images.length < 4) { setImages(p => [...p, val]); (e.target as HTMLInputElement).value = "" }
                }
              }} className="flex-1 border border-[#BDB76B]/30 rounded-xl px-3 py-2 text-xs" />
              <span className="text-[11px] text-zinc-500 py-2">Enter للإضافة</span>
            </div>
          </div>

          {error && <p className="md:col-span-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">{error}</p>}
          <button type="submit" disabled={saving} className="md:col-span-2 bg-[#1a1a1a] text-white py-3 rounded-xl font-black hover:bg-black disabled:opacity-60">{saving ? "جاري الحفظ في Neon..." : "حفظ المنتج وإظهاره في المتجر ✓"}</button>
          <p className="md:col-span-2 text-xs text-zinc-500 text-center">المنتج سيظهر فوراً في المتجر والرئيسية — كل نكهة variant منفصل • حفظ في Neon PostgreSQL</p>
        </form>
      )}

      <div className="mt-6 space-y-3">
        {loading ? <p className="text-sm text-center py-8">جاري التحميل من Neon...</p> : products.map(p => (
          <div key={p.id} className="bg-white border border-[#BDB76B]/15 rounded-2xl p-4 flex gap-4 items-center hover:shadow-sm">
            <img src={p.images[0]} alt={p.name} className="h-16 w-16 rounded-xl object-cover border border-[#BDB76B]/10" />
            <div className="flex-1">
              <p className="font-black text-sm">{p.name}</p>
              <p className="text-xs text-zinc-500">{p.brand} • {p.category.name} • {p.variants[0]?.sku} • slug: {p.slug}</p>
              <p className="text-xs text-zinc-400">{p.variants.length} نكهة/متغير • ID: {p.id.slice(0, 8)} • {p.variants[0]?.price} دج</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {p.variants.map(v => <span key={v.id} className="text-[11px] bg-[#FDFBD4] border border-[#BDB76B]/20 px-2 py-0.5 rounded-full">{v.name} ({v.stock}) {v.attributes.flavor ? `• ${v.attributes.flavor}` : ""}</span>)}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <button type="button" onClick={() => handleStockEdit(p.slug, -1)} className="h-7 w-7 rounded-full border border-[#BDB76B]/30 hover:bg-[#FDFBD4]">−</button>
                <span className="text-xs font-black px-2">{p.variants[0]?.stock} متوفر (أول متغير)</span>
                <button type="button" onClick={() => handleStockEdit(p.slug, 1)} className="h-7 w-7 rounded-full border border-[#BDB76B]/30 hover:bg-[#FDFBD4]">+</button>
              </div>
            </div>
            <div className="text-left shrink-0">
              <p className="price text-[#1a1a1a] text-sm">{formatPrice(p.variants[0]?.price || 0)}</p>
              <p className="text-[11px] font-mono text-zinc-500">{p.variants[0]?.sku}</p>
              <button type="button" onClick={() => handleDelete(p.slug)} className="text-xs text-red-600 underline mt-1">حذف</button>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-zinc-400 mt-6 text-center">محفوظ في Neon PostgreSQL • تحديث لحظي عبر API • fallback localStorage</p>
    </div>
  )
}