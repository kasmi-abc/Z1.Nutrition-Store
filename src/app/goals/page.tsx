"use client"
import Link from "next/link"
import { useProducts } from "@/hooks/useProducts"
import { IconMuscle, IconFire, IconZap, IconApple } from "@/components/Icons"

const goals = [
  { slug: "MUSCLE_GAIN" as const, label: "زيادة الكتلة العضلية", desc: "لمن يريد ضخامة نظيفة وقوة", icon: IconMuscle, color: "bg-[#1a1a1a] text-[#D4AF37]" },
  { slug: "WEIGHT_LOSS" as const, label: "حرق الدهون والتنشيف", desc: "تنشيف مع الحفاظ على العضل", icon: IconFire, color: "bg-[#CE8946] text-white" },
  { slug: "ENERGY" as const, label: "الطاقة والتركيز", desc: "طاقة انفجارية قبل التمرين", icon: IconZap, color: "bg-[#D4AF37] text-black" },
  { slug: "GENERAL" as const, label: "الفيتامينات والصحة العامة", desc: "دعم المناعة والمفاصل والدماغ", icon: IconApple, color: "bg-white border-2 border-[#BDB76B] text-[#1a1a1a]" },
]

export default function GoalsPage() {
  const products = useProducts()
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-black">حسب الهدف</h1>
      <p className="text-sm text-zinc-600 mt-1">اختر هدفك الرياضي وسنوجّهك للمنتجات المناسبة</p>

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        {goals.map((g) => {
          const list = products.filter((p) => p.goal === g.slug)
          return (
            <div key={g.slug} className="bg-white border border-[#BDB76B]/20 rounded-3xl overflow-hidden">
              <div className={`p-6 flex items-center gap-4 ${g.color}`}>
                <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center"><g.icon className="h-6 w-6" /></div>
                <div>
                  <h3 className="font-black">{g.label}</h3>
                  <p className="text-xs opacity-80">{g.desc} • {list!.length} منتج</p>
                </div>
                <Link href={`/products?goal=${g.slug}`} className="mr-auto bg-white text-black px-4 py-2 rounded-full text-xs font-black">تسوق</Link>
              </div>
              <div className="p-4 grid grid-cols-2 gap-3">
                {list!.slice(0, 2).map(p => (
                  <Link key={p.id} href={`/products/${p.slug}`} className="border border-[#BDB76B]/20 rounded-xl p-2 flex gap-2 hover:border-[#D4AF37]">
                    <img src={p.images[0]} alt={p.name} className="h-12 w-12 rounded-lg object-cover" />
                    <div>
                      <p className="text-xs font-black line-clamp-1">{p.name}</p>
                      <p className="text-xs text-[#CE8946] font-bold">{p.variants[0].price} دج</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-10 bg-[#1a1a1a] text-white rounded-2xl p-6 text-center">
        <p className="font-black">هل تحتاج مساعدة في الاختيار؟</p>
        <p className="text-sm text-white/70 mt-1">تواصل معنا واتساب وسنرشح لك الـ Stack المناسب لهدفك وميزانيتك</p>
        <a href="https://wa.me/213775123456" className="inline-block mt-4 bg-[#D4AF37] text-black px-6 py-2 rounded-full text-sm font-black">تواصل واتساب</a>
      </div>
    </div>
  )
}