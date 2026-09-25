# صور Z1 Nutrition - دليل

## المجلدات الجاهزة
```
public/images/
├── hero/hero-athlete.jpg (1400x900)
├── products/ (600x600 موحدة)
│   ├── whey-gold-standard.jpg
│   ├── whey-gold-standard-nutrition.jpg (600x800)
│   ├── creatine-300.jpg
│   ├── pre-workout.jpg
│   ├── omega3.jpg
│   ├── l-carnitine.jpg
│   └── mass-gainer.jpg
├── bundles/ (600x400)
├── blog/ (600x400)
├── reviews/ (400x400)
├── brands/ (شعارات - استخدم نص حالياً)
└── payments/
```

## كيف تضع صورك؟
1. ضع أي صورة بنفس الاسم والمجلد وسيعمل الموقع تلقائياً.
2. لا تقلق من المقاسات - Next.js يوحّدها تلقائياً.
3. للصور الحقيقية: احفظها بنفس الاسم واستبدل الملف.

## استيراد الصور
```bash
npm run images
```
يحمّل الصور بدقة موحّدة تلقائياً.

## مصادر مقترحة للصور الأصلية
- products: موقع العلامة الرسمي (Optimum Nutrition, MyProtein) - صور PNG بخلفية بيضاء موحدة أصلاً
- hero: unsplash.com/search/photos/athlete-gym
- brands: seeklogo.com (شعارات SVG)

## ملاحظة المقاسات
لو رفعت صورة بأي مقاس (مثلاً 1200x1500)، الموقع سيعرضها 600x600 تلقائياً عبر CSS object-cover + Next.js Image optimization. لا تحتاج تعديل يدوي.
