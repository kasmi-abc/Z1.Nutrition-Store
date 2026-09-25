"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminLogin() {
  const [user, setUser] = useState("")
  const [pass, setPass] = useState("")
  const [err, setErr] = useState("")
  const router = useRouter()

  const handle = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr("")
    if (!user.trim() || !pass.trim()) { setErr("أدخل البيانات"); return }
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user.trim(), password: pass }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErr(data.error || "اسم المستخدم أو كلمة المرور غير صحيحة")
        return
      }
      // purge LS
      localStorage.removeItem("z1-admin-auth")
      localStorage.removeItem("z1-admin-exp")
      router.push("/admin")
      router.refresh()
    } catch {
      setErr("خطأ في الاتصال، حاول مجدداً")
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-10">
      <form onSubmit={handle} className="bg-white border-2 border-[#D4AF37]/30 rounded-2xl p-8 w-full max-w-md shadow-lg">
        <div className="text-center">
          <img src="/z1-logo.jpg" alt="Z1" className="h-20 w-20 mx-auto rounded-2xl border-2 border-[#D4AF37] object-cover shadow" />
          <h1 className="text-2xl font-black mt-4 font-[var(--font-almarai)]">دخول الأدمن</h1>
        </div>

        <div className="mt-6 space-y-3">
          <input placeholder="اسم المستخدم" value={user} onChange={e => setUser(e.target.value)} className="w-full border-2 border-[#BDB76B]/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D4AF37] focus:bg-[#FDFBD4]/50" required />
          <input placeholder="كلمة المرور" type="password" value={pass} onChange={e => setPass(e.target.value)} className="w-full border-2 border-[#BDB76B]/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D4AF37] focus:bg-[#FDFBD4]/50" required />
          {err && <p className="text-sm text-red-600 font-bold bg-red-50 border border-red-200 rounded-xl p-3">{err}</p>}
          <button type="submit" className="w-full bg-[#D4AF37] text-black py-3.5 rounded-xl font-black hover:bg-[#BDB76B] text-base">دخول لوحة التحكم</button>
        </div>

        <p className="text-xs text-zinc-500 text-center mt-4">محمي - يتطلب تسجيل دخول</p>
      </form>
    </div>
  )
}