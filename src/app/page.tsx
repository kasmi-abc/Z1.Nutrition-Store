"use client"
import Link from "next/link"
import { categories } from "@/data/products"
import { ProductCard } from "@/components/ProductCard"
import { IconMuscle, IconFire, IconZap, IconApple, IconCheck, IconStar, IconTruck, IconPhone, IconCart } from "@/components/Icons"
import { useProducts } from "@/hooks/useProducts"

// cat icon dispatch
function CategoryIcon({ slug }: { slug: string }) {
  const cls = "h-6 w-6"
  switch (slug) {
    case "protein": return <IconMuscle className={cls} />
    case "creatine": return <IconZap className={cls} />
    case "pre-workout": return <IconFire className={cls} />
    case "vitamins": return <IconApple className={cls} />
    case "fat-burner": return <IconFire className={cls} />
    default: return <IconStar className={cls} />
  }
}

const brandImages = [
  { name: "Optimum Nutrition", src: "/images/brands/optimum-nutrition.png" },
  { name: "MyProtein", src: "/images/brands/myprotein.png" },
  { name: "Dymatize", src: "/images/brands/dymatize.png" },
  { name: "MuscleTech", src: "/images/brands/muscletech.png" },
  { name: "Now Foods", src: "/images/brands/now-foods.png" },
  { name: "C4", src: "/images/brands/c4.png" },
]

const bundles = [
  { id: "b1", name: "باك الضخامة الشامل", price: 3950, oldPrice: 4750, items: ["Whey 2kg", "Creatine 300g", "Shaker"], badge: "الأكثر مبيعاً", image: "/images/bundles/stack-mass.jpg" },
  { id: "b2", name: "باك التنشيف", price: 2850, oldPrice: 3400, items: ["Whey Isolate", "L-Carnitine", "Omega 3"], badge: "توفير 16%", image: "/images/bundles/stack-cut.jpg" },
  { id: "b3", name: "باك الطاقة", price: 2250, oldPrice: 2700, items: ["Pre-Workout", "Creatine", "BCAA"], badge: "جديد", image: "/images/bundles/stack-energy.jpg" },
]

const testimonials = [
  { name: "أمين - وهران", goal: "ضخامة", text: "وصلتني الطلبية في 24 ساعة، منتج أصلي والتغليف ممتاز. زدت 3كغ عضل في شهرين.", rating: 5 },
  { name: "سارة - الجزائر", goal: "صحة", text: "الـ Omega 3 فرق معي في التركيز والمفاصل. خدمة واتساب سريعة جداً.", rating: 5 },
  { name: "ياسين - قسنطينة", goal: "تنشيف", text: "باك التنشيف ساعدني أنشف 6كغ دهون مع الحفاظ على العضل. أنصح به.", rating: 4 },
]

export default function Home() {
  const products = useProducts()
  const bestSellers = products.filter(p => p.isFeatured).slice(0, 4)

  return (
    <div className="bg-[#FDFBD4]">
      {/* hero */}
      <section className="relative overflow-hidden bg-[#111111] text-white">
        <img src="/images/hero/hero-athlete.jpg" alt="Z1 Athlete" className="absolute inset-0 w-full h-full object-cover opacity-[0.12]" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-l from-[#D4AF37]/15 to-transparent" />
          <div className="absolute -left-20 -top-20 h-[480px] w-[480px] rounded-full bg-[#D4AF37]/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-flex items-center gap-2 bg-white/10 border border-[#D4AF37]/30 rounded-full px-3 py-1.5 badge-text">
              <span className="h-2 w-2 rounded-full bg-[#D4AF37] animate-pulse" />
              توصيل مجاني فوق 10000 دج • كود FIT10
            </span>
            <h1 className="hero-title mt-4">
              طاقتك القصوى
              <span className="block text-[#D4AF37]">تبدأ من هنا</span>
            </h1>
            <p className="mt-4 text-white/70 max-w-xl body-text leading-relaxed">
              مكملات أصلية 100% من أفضل الماركات العالمية. اختر هدفك، نكهتك، وحجمك — ووفّر مع الاشتراك الشهري والتوصيل لكل الولايات.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link href="/products" className="bg-[#D4AF37] text-black px-8 py-3.5 rounded-full font-black text-sm hover:bg-[#BDB76B] transition">
                تسوق المنتجات الآن
              </Link>
              <Link href="/bundles" className="border border-white/15 bg-white/5 px-8 py-3.5 rounded-full font-bold text-sm hover:bg-white/10 backdrop-blur">
                عروض الـ Packs
              </Link>
            </div>
            <div className="flex flex-wrap gap-4 mt-8 badge-text text-white/80">
              <span className="flex items-center gap-1.5"><IconCheck className="h-4 w-4 text-[#D4AF37]" /> منتجات أصلية</span>
              <span className="flex items-center gap-1.5"><IconCheck className="h-4 w-4 text-[#D4AF37]" /> دفع عند الاستلام</span>
              <span className="flex items-center gap-1.5"><IconCheck className="h-4 w-4 text-[#D4AF37]" /> 58 ولاية</span>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-5">
              <div className="grid grid-cols-2 gap-4">
                {bestSellers.map(p => (
                  <Link key={p.id} href={`/products/${p.slug}`} className="bg-white rounded-2xl p-3 text-black hover:shadow-lg transition group">
                    <img src={p.images[0]} alt={p.name} className="rounded-xl aspect-square object-cover w-full group-hover:scale-[1.02] transition" />
                    <p className="product-title mt-2 line-clamp-1">{p.name}</p>
                    <p className="badge-text text-zinc-500">{p.brand}</p>
                    <p className="price text-[#1a1a1a] mt-1">{p.variants[0].price} دج</p>
                  </Link>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between badge-text text-white/60">
                <span className="flex items-center gap-1"><IconStar className="h-3.5 w-3.5 text-[#D4AF37]" filled /> 4.8/5 من 500+ تقييم</span>
                <span>شحن خلال 24 ساعة</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* categories + bestsellers */}
      <section className="block-cream py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Goal Quick Links */}
          <div className="flex items-end justify-between">
            <h2 className="section-title">اختر هدفك</h2>
            <Link href="/goals" className="badge-text underline decoration-[#D4AF37] decoration-2">عرض كل الأهداف</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
            {[
              { label: "زيادة الكتلة العضلية", slug: "MUSCLE_GAIN", icon: IconMuscle, desc: "بروتين + كرياتين", color: "bg-[#1a1a1a] text-[#D4AF37]" },
              { label: "حرق الدهون والتنشيف", slug: "WEIGHT_LOSS", icon: IconFire, desc: "حوارق دهون", color: "bg-[#CE8946] text-white" },
              { label: "الطاقة والتركيز", slug: "ENERGY", icon: IconZap, desc: "Pre-workout", color: "bg-[#D4AF37] text-black" },
              { label: "الفيتامينات والصحة", slug: "GENERAL", icon: IconApple, desc: "Omega 3 وغيرها", color: "bg-white border-2 border-[#BDB76B] text-[#1a1a1a]" },
            ].map(g => (
              <Link key={g.slug} href={`/products?goal=${g.slug}`} className="group text-center">
                <div className={`mx-auto h-[92px] w-[92px] rounded-full flex items-center justify-center ${g.color} group-hover:scale-105 transition shadow-sm`}>
                  <g.icon className="h-8 w-8" />
                </div>
                <p className="font-bold text-sm mt-3 font-[var(--font-cairo)]">{g.label}</p>
                <p className="badge-text text-zinc-500">{g.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* categories */}
      <section className="block-cream pb-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="section-title">تسوق حسب الفئة</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
            {categories.map(c => (
              <Link key={c.id} href={`/products?category=${c.slug}`} className="bg-white border border-[#BDB76B]/15 rounded-2xl p-6 text-center hover:border-[#D4AF37]/40 hover:shadow-md transition group">
                <div className="h-14 w-14 mx-auto rounded-2xl bg-[#FDFBD4] border border-[#BDB76B]/20 flex items-center justify-center text-[#1a1a1a] group-hover:bg-[#1a1a1a] group-hover:text-[#D4AF37] transition">
                  <CategoryIcon slug={c.slug} />
                </div>
                <p className="font-bold text-sm mt-3">{c.name}</p>
                <p className="badge-text text-zinc-500 mt-1">{products.filter(p => p.category.slug === c.slug).length} منتج</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* bestsellers */}
      <section className="block-cream pb-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-title flex items-center gap-3">
              المنتجات الأكثر مبيعاً
              <span className="bg-[#D4AF37] text-black text-xs px-2.5 py-1 rounded-full font-black">Best Sellers</span>
            </h2>
            <Link href="/products" className="badge-text bg-white border border-[#BDB76B]/25 px-4 py-2 rounded-full hover:border-[#D4AF37]">عرض الكل</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* marquee */}
      <section className="block-cream pb-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-[#BDB76B]/15 rounded-2xl py-5 overflow-hidden">
            <p className="text-center badge-text tracking-[0.15em] text-zinc-400">علامات تجارية موثوقة</p>
            <div className="brands-viewport mt-4">
              <div className="brands-track">
                {[...brandImages, ...brandImages].map((b, i) => (
                  <img key={i} src={b.src} alt={b.name} className="brand-item h-12 w-auto object-contain bg-[#FDFBD4] border border-[#BDB76B]/20 px-4 py-2 rounded-full shrink-0" />
                ))}
              </div>
            </div>
            <p className="text-center badge-text text-zinc-500 mt-3">منتجات أصلية 100% • فواتير وضمان</p>
          </div>
        </div>
      </section>

      {/* bundles */}
      <section className="block-dark py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="section-title text-white">الحزم والعروض الذكية</h2>
              <p className="body-text text-white/60 mt-1">وفّر أكثر مع الـ Stacks المتكاملة - خلفية مميزة للعروض</p>
            </div>
            <Link href="/bundles" className="hidden sm:inline-flex bg-white text-black px-5 py-2 rounded-full badge-text font-black">كل الـ Bundles</Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            {bundles.map(b => (
              <div key={b.id} className="bg-white text-[#1a1a1a] rounded-3xl overflow-hidden hover:shadow-xl transition">
                <div className="bg-[#FDFBD4] border-b border-[#BDB76B]/20 p-4 flex items-center justify-between">
                  <span className="bg-[#1a1a1a] text-[#D4AF37] px-2.5 py-1 rounded-full badge-text">{b.badge}</span>
                  <span className="badge-text font-bold">{b.items.join(" + ")}</span>
                </div>
                <img src={b.image} alt={b.name} className="w-full h-40 object-cover" />
                <div className="p-6">
                  <h3 className="font-black text-[17px] font-[var(--font-cairo)]">{b.name}</h3>
                  <p className="badge-text text-zinc-500 mt-1">{b.items.join(" • ")}</p>
                  <div className="flex items-baseline gap-2 mt-4">
                    <span className="price text-[#1a1a1a]">{b.price} دج</span>
                    <span className="text-sm line-through text-zinc-400">{b.oldPrice} دج</span>
                  </div>
                  <Link href="/bundles" className="block text-center mt-4 bg-[#D4AF37] text-black py-3 rounded-full font-black text-sm hover:bg-[#BDB76B]">عرض الـ Pack</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* testimonials */}
      <section className="block-cream py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <h2 className="section-title">آراء العملاء وتجاربهم</h2>
            <span className="hidden sm:flex items-center gap-1 badge-text text-zinc-500">
              <IconStar className="h-4 w-4 text-[#D4AF37]" filled /> 4.8/5 من 500+ عميل
            </span>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white border border-[#BDB76B]/15 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[#FDFBD4] border border-[#BDB76B]/30 flex items-center justify-center font-black text-sm">{t.name[0]}</div>
                  <div>
                    <p className="font-bold text-sm">{t.name}</p>
                    <p className="badge-text text-zinc-500">{t.goal}</p>
                  </div>
                  <span className="mr-auto flex text-[#D4AF37] text-sm">
                    {"★".repeat(t.rating)}<span className="text-zinc-300">{"★".repeat(5 - t.rating)}</span>
                  </span>
                </div>
                <p className="body-text mt-3 leading-relaxed text-zinc-700">"{t.text}"</p>
                <p className="badge-text text-zinc-400 mt-3 flex items-center gap-1"><IconCheck className="h-3 w-3 text-emerald-500" /> شراء مؤكد • توصيل وهران</p>
              </div>
            ))}
          </div>
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div className="bg-white border border-[#BDB76B]/15 rounded-2xl p-5">
              <p className="font-black text-2xl text-[#1a1a1a] font-[var(--font-almarai)]">5000+</p>
              <p className="badge-text text-zinc-500">عميل سعيد</p>
            </div>
            <div className="bg-white border border-[#BDB76B]/15 rounded-2xl p-5">
              <p className="font-black text-2xl text-[#1a1a1a] font-[var(--font-almarai)]">58</p>
              <p className="badge-text text-zinc-500">ولاية توصيل</p>
            </div>
            <div className="bg-white border border-[#BDB76B]/15 rounded-2xl p-5">
              <p className="font-black text-2xl text-[#1a1a1a] font-[var(--font-almarai)]">24h</p>
              <p className="badge-text text-zinc-500">توصيل سريع</p>
            </div>
          </div>
        </div>
      </section>

      {/* features */}
      <section className="block-cream pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: "منتج أصلي 100%", desc: "مضمون مع فاتورة", icon: IconCheck },
              { title: "توصيل 58 ولاية", desc: "24-48 ساعة", icon: IconTruck },
              { title: "دعم واتساب", desc: "رد خلال دقائق", icon: IconPhone },
              { title: "دفع عند الاستلام", desc: "آمن وسهل", icon: IconStar },
            ].map(f => (
              <div key={f.title} className="bg-white border border-[#BDB76B]/15 rounded-2xl p-5 text-center">
                <div className="h-10 w-10 mx-auto rounded-full bg-[#FDFBD4] border border-[#BDB76B]/30 flex items-center justify-center"><f.icon className="h-5 w-5 text-[#CE8946]" /></div>
                <p className="font-bold text-sm mt-3">{f.title}</p>
                <p className="badge-text text-zinc-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}