# Z1 Nutrition — خارطة الطريق التقنية

## نظرة عامة
متجر مكملات غذائية متكامل — التركيز على الأداء، تجربة المستخدم، والجاهزية للإنتاج.

## المكدس التقني
Next.js 16 • TypeScript • Tailwind CSS 4 • Prisma 6 (PostgreSQL) • Vercel

## الميزات المنجزة
- [x] Foundation: Next.js 16 + Tailwind 4 + Prisma 6 (PostgreSQL Neon) + TypeScript + bcryptjs/jose/zod
- [x] Backend 100%: Neon PostgreSQL متصل ✓ (prisma db push + seed 6 منتجات + 5 فئات + 3 برومو + Admin)
- [x] Auth: httpOnly JWT (jose HS256 12h) + middleware حماية /admin + /api + rate limiting + bcrypt
- [x] API Routes: /api/auth/*, /api/products, /api/categories, /api/orders, /api/promos/* مع validation zod + pagination
- [x] Catalog: صفحة رئيسية، كتالوج مع فلترة/بحث/pagination 12/صفحة + واجهة RTL
- [x] Product Detail: معرض صور، Variants (نكهة/حجم)، اشتراك، تقييمات، منتجات مشابهة
- [x] Commerce: سلة localStorage sync + checkout API (Neon) + promo validate + تتبع TRK- + وصل طباعة
- [x] Admin: إدارة منتجات (Neon API + fallback localStorage)، طلبات (تحديث حالة PATCH)، برومو (تفعيل/حذف)
- [x] Polish: أمن (headers + HSTS + noindex admin + sanitizers) + أداء (indexes + pooling) + SEO + طباعة

## التحسينات القادمة
- [x] ربط Neon/Supabase للإنتاج — تم ✓ (ep-super-salad-b5yalgrz-pooler.c-7.us-east-2.aws.neon.tech)
- [ ] بوابة دفع BaridiMob/CCP
- [ ] اختبارات E2E (Playwright)
- [ ] تحسين صور عبر next/image (حالياً <img> مع 4 صور drag&drop)
- [ ] مراقبة Sentry / Logging مركزي

## التشغيل
```bash
npm install
npm run dev
```

## النشر
```bash
npm run build
vercel --prod
```
