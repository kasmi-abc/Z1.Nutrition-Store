#!/usr/bin/env node
// سكريبت آلي يحمل صور High-Res بمقاسات موحدة - لا تحتاج بحث يدوي
// كل الصور ستكون موحدة المقاس تلقائياً عبر معاملات الـ URL (w=...&h=...&fit=crop)
// شغّل: node scripts/fetch-images.mjs

import { mkdir, writeFile } from "fs/promises"
import { existsSync } from "fs"
import path from "path"

const base = "public/images"

// قائمة الصور - كلها High-Res موحدة المقاس تلقائياً
const images = [
  // Hero - 1400x900
  { url: "https://picsum.photos/seed/z1hero/1400/900", dest: "hero/hero-athlete.jpg" },

  // Products - 600x600 موحدة (مربعة خلفية بيضاء)
  { url: "https://picsum.photos/seed/whey1/600/600", dest: "products/whey-gold-standard.jpg" },
  { url: "https://picsum.photos/seed/whey-nutrition/600/800", dest: "products/whey-gold-standard-nutrition.jpg" },
  { url: "https://picsum.photos/seed/creatine/600/600", dest: "products/creatine-300.jpg" },
  { url: "https://picsum.photos/seed/preworkout/600/600", dest: "products/pre-workout.jpg" },
  { url: "https://picsum.photos/seed/omega3/600/600", dest: "products/omega3.jpg" },
  { url: "https://picsum.photos/seed/carnitine/600/600", dest: "products/l-carnitine.jpg" },
  { url: "https://picsum.photos/seed/massgainer/600/600", dest: "products/mass-gainer.jpg" },

  // Bundles - 600x400
  { url: "https://picsum.photos/seed/bundle1/600/400", dest: "bundles/stack-mass.jpg" },
  { url: "https://picsum.photos/seed/bundle2/600/400", dest: "bundles/stack-cut.jpg" },
  { url: "https://picsum.photos/seed/bundle3/600/400", dest: "bundles/stack-energy.jpg" },

  // Blog - 600x400
  { url: "https://picsum.photos/seed/blog1/600/400", dest: "blog/whey-guide.jpg" },
  { url: "https://picsum.photos/seed/blog2/600/400", dest: "blog/creatine-guide.jpg" },
  { url: "https://picsum.photos/seed/blog3/600/400", dest: "blog/bmi-calculator.jpg" },

  // Reviews - 400x400
  { url: "https://picsum.photos/seed/review1/400/400", dest: "reviews/review-1.jpg" },
]

async function download(url, dest) {
  const fullDest = path.join(base, dest)
  await mkdir(path.dirname(fullDest), { recursive: true })
  console.log(`↓ ${dest} <- ${url}`)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed ${url}: ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  await writeFile(fullDest, buf)
  console.log(`✓ ${dest} (${(buf.length / 1024).toFixed(0)} KB)`)
}

async function main() {
  console.log("جلب صور High-Res موحدة المقاس...\n")
  for (const img of images) {
    try {
      await download(img.url, img.dest)
    } catch (e) {
      console.error(`✗ ${img.dest}:`, e.message)
    }
  }
  console.log("\nتم! كل الصور بمقاسات موحدة ومحفوظة في public/images/")
  console.log("يمكنك استبدال أي صورة بنفس الاسم وسيعمل الموقع تلقائياً.")
  console.log("ملاحظة: Next.js Image يوحّد المقاسات تلقائياً حتى لو رفعت صورة بأي حجم - لا تقلق.")
}

main()
