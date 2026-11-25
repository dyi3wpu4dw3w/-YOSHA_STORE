"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function AuthCallback() {
  const [message, setMessage] = useState("جارٍ تأكيد بريدك الإلكتروني...");
  useEffect(() => {
    let active = true;
    async function confirm() {
      const supabase = createClient();
      if (!supabase) {
        if (active) setMessage("تعذر الاتصال بالخدمة. حاول مرة أخرى لاحقاً.");
        return;
      }
      const code = new URLSearchParams(window.location.search).get("code");
      if (!code) {
        if (active) setMessage("رابط التأكيد غير مكتمل أو منتهي الصلاحية.");
        return;
      }
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!active) return;
      if (error) setMessage("تعذر تأكيد البريد: " + error.message);
      else {
        setMessage("تم تأكيد بريدك الإلكتروني بنجاح. أهلاً بك في يوشا!");
        window.setTimeout(() => { window.location.href = "/account"; }, 1400);
      }
    }
    confirm();
    return () => { active = false; };
  }, []);
  return <main className="container" style={{ maxWidth: 560, padding: "70px 20px" }}>
    <section className="card" style={{ padding: 28, textAlign: "center" }}>
      <h1 style={{ fontSize: 28, fontWeight: 900 }}>YOSHA</h1>
      <p role="status" style={{ lineHeight: 1.9 }}>{message}</p>
      <Link className="btn" href="/auth">العودة لتسجيل الدخول</Link>
    </section>
  </main>;
}
