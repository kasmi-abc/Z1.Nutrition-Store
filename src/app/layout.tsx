import type { Metadata } from "next";
import { Cairo, Tajawal, Almarai } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-cairo",
  display: "swap",
});

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-tajawal",
  display: "swap",
});

const almarai = Almarai({
  subsets: ["arabic"],
  weight: ["400", "700", "800"],
  variable: "--font-almarai",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Z1 Nutrition - متجر المكملات الأصلي | الجزائر",
    template: "%s | Z1 Nutrition",
  },
  description: "وجهتك الأولى للمكملات الغذائية الأصلية في الجزائر. بروتين، كرياتين، pre-workout، فيتامينات - توصيل 58 ولاية والدفع عند الاستلام.",
  metadataBase: new URL("https://z1-nutrition.dz"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "Z1 Nutrition - متجر المكملات الأصلي",
    description: "مكملات أصلية 100% - بروتين، كرياتين، فيتامينات - توصيل 58 ولاية",
    locale: "ar_DZ",
    type: "website",
    siteName: "Z1 Nutrition",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${tajawal.variable} ${almarai.variable}`}>
      <body className="min-h-screen antialiased font-[var(--font-cairo)] bg-[#FDFBD4]">
        <Header />
        <CartDrawer />
        <main className="min-h-[60vh] bg-[#FDFBD4]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}