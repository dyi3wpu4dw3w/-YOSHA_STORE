"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function Apply() {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    const supabase = createClient();
    if (!supabase) {
      setMessage("إعدادات قاعدة البيانات غير مكتملة.");
      return;
    }

    setBusy(true);
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) {
        window.location.href = "/auth";
        return;
      }

      const { data, error } = await supabase.rpc("create_seller_application", {
        p_business_name: name.trim(),
        p_phone: phone.trim(),
        p_description: description.trim(),
      });
      if (error) throw error;
      if (!data?.store_id) throw new Error("لم يتم إنشاء سجل المتجر، حاول مرة أخرى.");

      setMessage("تم إنشاء طلب متجرك بنجاح. المتجر الآن قيد مراجعة الإدارة، وسيظهر في لوحة التاجر بعد الاعتماد.");
      setName("");
      setPhone("");
      setDescription("");
    } catch (error: unknown) {
      const detail = error && typeof error === "object" && "message" in error
        ? String((error as { message: unknown }).message)
        : error instanceof Error ? error.message : "حدث خطأ غير معروف";
      setMessage("تعذر إنشاء المتجر: " + detail);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="container" style={{ maxWidth: 680, padding: "36px 0" }}>
      <Link href="/seller">← مركز البائعين</Link>
      <h1 style={{ fontSize: 34 }}>إنشاء متجر جديد</h1>
      <p className="muted">أدخل بيانات نشاطك التجاري. سيتم إنشاء سجل المتجر مباشرة بحالة قيد المراجعة، ثم تفعيله بعد موافقة الإدارة.</p>
      <form className="card" onSubmit={send} style={{ padding: 22, display: "grid", gap: 14 }}>
        <input required maxLength={100} value={name} onChange={e => setName(e.target.value)} placeholder="اسم المتجر أو النشاط التجاري" className="card" style={{ padding: 13 }} />
        <input required maxLength={30} value={phone} onChange={e => setPhone(e.target.value)} placeholder="رقم التواصل" className="card" style={{ padding: 13 }} />
        <textarea required maxLength={1000} value={description} onChange={e => setDescription(e.target.value)} placeholder="وصف المتجر والمنتجات التي ستبيعها" className="card" style={{ padding: 13, minHeight: 120 }} />
        <button className="btn" disabled={busy}>{busy ? "جارٍ إنشاء المتجر..." : "إنشاء المتجر وإرسال للمراجعة"}</button>
        {message && <p role="status" className="pill">{message}</p>}
      </form>
    </main>
  );
}
