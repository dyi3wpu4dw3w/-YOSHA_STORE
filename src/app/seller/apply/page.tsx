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

      const { error } = await supabase.from("seller_applications").insert({
        user_id: user.id,
        business_name: name.trim(),
        phone: phone.trim(),
        description: description.trim(),
      });

      if (error) throw error;
      setMessage("وصل طلبك بنجاح، وسيتم مراجعته من إدارة يوشا.");
    } catch (error: unknown) {
      const detail = error && typeof error === "object" && "message" in error
        ? String((error as { message: unknown }).message)
        : error instanceof Error ? error.message : "حدث خطأ غير معروف";
      const code = error && typeof error === "object" && "code" in error
        ? String((error as { code: unknown }).code)
        : "";
      setMessage(code ? `تعذر إرسال الطلب: ${detail} ( ${code} )` : `تعذر إرسال الطلب: ${detail}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="container" style={{ maxWidth: 680, padding: "36px 0" }}>
      <Link href="/seller">← مركز البائعين</Link>
      <h1 style={{ fontSize: 34 }}>طلب إنشاء متجر</h1>
      <p className="muted">أرسل بيانات نشاطك التجاري لبدء مراجعة الطلب.</p>
      <form className="card" onSubmit={send} style={{ padding: 22, display: "grid", gap: 14 }}>
        <input required value={name} onChange={e => setName(e.target.value)} placeholder="اسم النشاط التجاري" className="card" style={{ padding: 13 }} />
        <input required value={phone} onChange={e => setPhone(e.target.value)} placeholder="رقم التواصل" className="card" style={{ padding: 13 }} />
        <textarea required value={description} onChange={e => setDescription(e.target.value)} placeholder="نبذة عن نشاطك والمنتجات التي ستبيعها" className="card" style={{ padding: 13, minHeight: 120 }} />
        <button className="btn" disabled={busy}>{busy ? "جارٍ الإرسال..." : "إرسال طلب المراجعة"}</button>
        {message && <p role="status" className="pill">{message}</p>}
      </form>
    </main>
  );
}
