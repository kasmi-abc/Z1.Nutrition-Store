import Link from "next/link"

const posts = [
  {
    slug: "how-to-choose-whey",
    title: "كيف تختار الواي بروتين المناسب؟ دليل 2026",
    excerpt: "الفرق بين Whey Concentrate و Isolate و Hydrolyzed ومتى تختار كل نوع حسب هدفك وميزانيتك.",
    category: "تغذية",
    readTime: "5 دقائق",
    date: "2026-09-10",
    image: "/images/blog/whey-guide.jpg",
  },
  {
    slug: "creatine-guide",
    title: "الكرياتين: الفوائد، الجرعة، وأفضل وقت للاستخدام",
    excerpt: "كل ما تحتاج معرفته عن الكرياتين مونوهيدرات لزيادة القوة والكتلة العضلية بأمان.",
    category: "مكملات",
    readTime: "4 دقائق",
    date: "2026-09-05",
    image: "/images/blog/creatine-guide.jpg",
  },
  {
    slug: "cutting-stack",
    title: "جدول تنشيف 4 أسابيع مع مكملات مقترحة",
    excerpt: "خطة تغذية وتمارين مع Stack التنشيف (Whey + L-Carnitine + Omega 3) لحرق الدهون بذكاء.",
    category: "تمارين",
    readTime: "7 دقائق",
    date: "2026-08-28",
    image: "/images/blog/bmi-calculator.jpg",
  },
  {
    slug: "bmi-calculator",
    title: "حاسبة السعرات ومؤشر كتلة الجسم - أداة مجانية",
    excerpt: "احسب سعراتك اليومية واحتياجك من البروتين واقتراح المنتجات المناسبة تلقائياً.",
    category: "أدوات",
    readTime: "أداة تفاعلية",
    date: "2026-08-20",
    image: "/images/blog/whey-guide.jpg",
  },
]

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center">
        <h1 className="text-3xl font-black">مدونة الصحة والرياضة</h1>
        <p className="text-sm text-zinc-600 mt-2">مقالات تغذية، جداول تمرين، وكيفية استخدام المكملات لتعزيز السيو</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {posts.map(p => (
          <article key={p.slug} className="bg-white border border-[#BDB76B]/20 rounded-2xl overflow-hidden hover:shadow-md transition group">
            <div className="relative h-48 overflow-hidden bg-[#FDFBD4]">
              <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              <span className="absolute top-3 right-3 bg-[#D4AF37] text-black text-xs font-black px-3 py-1 rounded-full">{p.category}</span>
            </div>
            <div className="p-5">
              <p className="text-xs text-zinc-500">{p.date} • {p.readTime}</p>
              <h3 className="font-black mt-2 line-clamp-2">{p.title}</h3>
              <p className="text-sm text-zinc-600 mt-2 line-clamp-2">{p.excerpt}</p>
              <Link href={`/blog/${p.slug}`} className="inline-block mt-4 text-sm font-black text-[#CE8946] underline">اقرأ المقال</Link>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-10 bg-[#D4AF37] rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-black">حاسبة السعرات (قريباً)</p>
          <p className="text-sm text-black/70">أداة مجانية تقترح المنتجات المناسبة لهدفك تلقائياً</p>
        </div>
        <Link href="/goals" className="bg-black text-white px-6 py-2 rounded-full text-sm font-black">جرب الحاسبة</Link>
      </div>
    </div>
  )
}