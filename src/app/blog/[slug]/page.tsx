import Link from "next/link"

const posts: Record<string, { title: string; content: string; image: string }> = {
  "how-to-choose-whey": { title: "كيف تختار الواي بروتين المناسب؟", content: "الواي Concentrate للميزانية، Isolate للتنشيف، Hydrolyzed للهضم السريع. اختر حسب هدفك: تضخيم → Concentrate 80%, تنشيف → Isolate.", image: "/images/blog/whey-guide.jpg" },
  "creatine-guide": { title: "الكرياتين: الفوائد والجرعة", content: "5g يومياً بعد التمرين مع ماء أو عصير. آمن للكلى عند الجرعة الموصى بها. يزيد القوة خلال 2-3 أسابيع.", image: "/images/blog/creatine-guide.jpg" },
  "cutting-stack": { title: "جدول تنشيف 4 أسابيع", content: "كارديو 4×/أسبوع + عجز سعرات 300-500 + Stack: Whey Isolate + L-Carnitine + Omega 3.", image: "/images/blog/bmi-calculator.jpg" },
  "bmi-calculator": { title: "حاسبة السعرات", content: "استخدم أداة BMI في الموقع لحساب احتياجك اليومي واقتراح المنتجات.", image: "/images/blog/whey-guide.jpg" },
}

export function generateStaticParams() {
  return Object.keys(posts).map(slug => ({ slug }))
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = posts[slug]
  if (!post) return <div className="mx-auto max-w-3xl px-4 py-16 text-center"><p className="font-black">المقال غير موجود</p><Link href="/blog" className="text-[#CE8946] underline">عودة للمدونة</Link></div>
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/blog" className="text-xs underline">← المدونة</Link>
      <img src={post.image} alt={post.title} className="w-full h-64 object-cover rounded-2xl mt-4" />
      <h1 className="text-2xl font-black mt-6">{post.title}</h1>
      <p className="text-zinc-600 mt-4 leading-relaxed">{post.content}</p>
      <div className="mt-6 flex gap-2">
        <Link href="/products" className="bg-[#D4AF37] text-black px-6 py-2 rounded-full font-black text-sm">تسوق المنتجات</Link>
        <Link href="/bmi" className="border px-6 py-2 rounded-full font-bold text-sm">حاسبة السعرات</Link>
      </div>
    </div>
  )
}