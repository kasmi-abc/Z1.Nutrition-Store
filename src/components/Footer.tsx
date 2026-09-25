import Link from "next/link"
import { IconPhone, IconTruck } from "@/components/Icons"

export function Footer() {
  return (
    <footer className="bg-[#111111] text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3">
              <img src="/z1-logo.jpg" alt="Z1 Nutrition" className="h-12 w-12 rounded-xl object-cover border-2 border-[#D4AF37]" />
              <div>
                <p className="font-black tracking-tight font-[var(--font-almarai)]">Z1 NUTRITION</p>
                <p className="text-xs tracking-[0.15em] text-[#D4AF37] font-bold">SUPPLEMENTS STORE</p>
              </div>
            </div>
            <p className="text-sm text-white/60 mt-4 leading-relaxed body-text">
              وجهتك الأولى للمكملات الغذائية الأصلية ومستلزمات الرياضيين في الجزائر. بيع بالجملة والتجزئة، منتجات مضمونة 100% وتوصيل لكل الولايات.
            </p>
          </div>

          <div>
            <h4 className="font-black text-[#D4AF37] text-sm">روابط سريعة</h4>
            <ul className="mt-4 space-y-2 text-sm text-white/60">
              <li><Link href="/about" className="hover:text-white">من نحن</Link></li>
              <li><Link href="/products" className="hover:text-white">المنتجات</Link></li>
              <li><Link href="/bundles" className="hover:text-white">العروض والـ Packs</Link></li>
              <li><Link href="/goals" className="hover:text-white">حسب الهدف</Link></li>
              <li><Link href="/blog" className="hover:text-white">المدونة</Link></li>
              <li><Link href="/track" className="hover:text-white">تتبع الطلبية</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-[#D4AF37] text-sm">التواصل والدعم</h4>
            <ul className="mt-4 space-y-3 text-sm text-white/60">
              <li className="flex items-center gap-2">
                <IconPhone className="h-4 w-4 text-[#D4AF37]" />
                0775 12 34 56 - 0661 98 76 54
              </li>
              <li className="flex items-center gap-2">
                <IconTruck className="h-4 w-4 text-[#D4AF37]" />
                التوصيل لـ 58 ولاية - 24/48 ساعة
              </li>
              <li>الجزائر العاصمة - باب الزوار</li>
              <li>السبت - الخميس 9:00 - 19:00</li>
              <li><span className="inline-flex bg-[#D4AF37] text-black px-3 py-1 rounded-full text-xs font-black">واتساب مباشر</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-[#D4AF37] text-sm">الدفع والثقة</h4>
            <div className="mt-4 space-y-3">
              <div className="bg-white text-black rounded-xl p-3">
                <p className="text-xs font-black">الدفع عند الاستلام</p>
                <p className="text-xs text-zinc-600">Cash on Delivery - آمن 100%</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="bg-white/10 border border-white/10 rounded-lg h-10 flex items-center justify-center text-[10px] font-black">CCP</span>
                <span className="bg-white/10 border border-white/10 rounded-lg h-10 flex items-center justify-center text-[10px] font-black">Baridi</span>
                <span className="bg-white/10 border border-white/10 rounded-lg h-10 flex items-center justify-center text-[10px] font-black">COD</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between text-xs text-white/40 relative">
          <span>© 2026 Z1 Nutrition. جميع الحقوق محفوظة.</span>
          <span className="absolute left-1/2 -translate-x-1/2 hidden sm:inline-flex items-center gap-1">
            تطوير المتجر بواسطة{" "}
            <a href="https://www.instagram.com/abdelkader_haith/" target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] hover:text-white underline">
              Kasmi .H dev
            </a>
          </span>
          <span className="hidden sm:inline">صمم بعناية للرياضيين في الجزائر</span>
        </div>
        <div className="sm:hidden flex justify-center pb-3 text-xs text-white/40">
          <span>
            تطوير المتجر بواسطة{" "}
            <a href="https://www.instagram.com/abdelkader_haith/" target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] underline">
              Kasmi .H dev
            </a>
          </span>
        </div>
      </div>
    </footer>
  )
}