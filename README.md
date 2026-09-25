# Z1 Nutrition — متجر المكملات الغذائية

متجر إلكتروني متكامل للمكملات الغذائية (بروتين، كرياتين، Pre-Workout، فيتامينات، حوارق دهون) — واجهة عربية RTL، دفع عند الاستلام، توصيل 58 ولاية.

**Live Demo:** `https://z1-nutrition.vercel.app` *(بعد النشر)*

## المميزات
- كتالوج مع فلترة متقدمة (هدف/فئة/ماركة/نكهة/سعر) + بحث + pagination 12/صفحة
- صفحة تفاصيل مع Variants (نكهة/حجم) + صور متعددة + تبويبات غذائية + تقييمات
- سلة مشتريات مع حساب الشحن والخصم + كود برومو `FIT10`
- دفع عند الاستلام + وصول نظيف للطباعة + تتبع الطلب `TRK-`
- لوحة إدارة `/admin` (منتجات/طلبات/بروموهات) مع رفع صور drag&drop
- wishlist + مقارنة + حاسبة سعرات BMI

## التقنيات
Next.js 16 (App Router) • TypeScript • Tailwind CSS 4 • Prisma 6 • Zustand (localStorage sync) • Vercel

## التشغيل محلياً
```bash
git clone <repo>
cd supplement-store
npm install
npm run dev
# http://localhost:3000
```

## متغيرات البيئة
انسخ `.env.example` إلى `.env`:
```
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
```

## البنية
```
src/
 ├─ app/(page.tsx, products/[slug], cart, checkout, orders, admin, bmi, blog)
 ├─ components/(Header, ProductCard, ProductDetailClient, CartDrawer)
 ├─ hooks/useProducts.ts
 ├─ store/(cart.ts, wishlist.ts)
 ├─ lib/(utils.ts, validators.ts)
 └─ data/products.ts
prisma/schema.prisma
public/images/
```

## النشر
```bash
npm run build
vercel --prod
```

## الترخيص
خاص — Z1 Nutrition © 2026
