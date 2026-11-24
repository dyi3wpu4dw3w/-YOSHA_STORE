"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ArrowRight, PackagePlus, Pencil, Trash2, RefreshCw } from "lucide-react";

type Product = {
  id: string; name: string; description: string | null; price: number;
  currency: string; stock: number; active: boolean; image_urls: string[];
  slug: string; category_id: string | null;
};
type Store = { id: string; name: string; status: string };
const empty = { name: "", description: "", price: "", stock: "1", image: "", active: false, category_id: "" };
const slugify = (value: string) => value.trim().toLowerCase().normalize("NFKD")
  .replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function SellerProducts() {
  const [client, setClient] = useState<any>(null);
  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const load = useCallback(async (db: any, ownerId: string) => {
    const { data: stores, error: storeError } = await db.from("stores")
      .select("id,name,status").eq("owner_id", ownerId).order("created_at", { ascending: false }).limit(1);
    if (storeError) throw storeError;
    const current = stores?.[0] || null;
    setStore(current);
    const [{ data: cats, error: catError }, { data: rows, error: productError }] = await Promise.all([
      db.from("categories").select("id,name").eq("active", true).order("name"),
      current ? db.from("products").select("*").eq("store_id", current.id).order("created_at", { ascending: false })
        : Promise.resolve({ data: [], error: null })
    ]);
    if (catError) throw catError;
    if (productError) throw productError;
    setCategories(cats || []);
    setProducts(rows || []);
  }, []);

  useEffect(() => {
    const db = createClient();
    setClient(db);
    if (!db) { setMessage("إعدادات Supabase غير مكتملة."); setLoading(false); return; }
    db.auth.getUser().then(async ({ data: { user } }: any) => {
      if (!user) { window.location.href = "/auth"; return; }
      try { await load(db, user.id); }
      catch (e: any) { setMessage(e?.message || "تعذر تحميل المنتجات"); }
      finally { setLoading(false); }
    });
  }, [load]);

  function reset() { setForm(empty); setEditing(null); }
  function edit(product: Product) {
    setEditing(product.id);
    setForm({ name: product.name, description: product.description || "", price: String(product.price),
      stock: String(product.stock), image: product.image_urls?.[0] || "", active: product.active,
      category_id: product.category_id || "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  async function save(e: React.FormEvent) {
    e.preventDefault(); setMessage("");
    if (!client || !store) return;
    const price = Number(form.price), stock = Number(form.stock);
    if (!form.name.trim() || !Number.isFinite(price) || price < 0 || !Number.isInteger(stock) || stock < 0) {
      setMessage("راجع اسم المنتج والسعر والكمية قبل الحفظ."); return;
    }
    setBusy(true);
    try {
      const payload = { store_id: store.id, name: form.name.trim(), slug: slugify(form.name) || "product",
        description: form.description.trim() || null, price, stock, currency: "SDG",
        image_urls: form.image.trim() ? [form.image.trim()] : [],
        category_id: form.category_id || null, active: form.active };
      const result = editing
        ? await client.from("products").update(payload).eq("id", editing).eq("store_id", store.id)
        : await client.from("products").insert(payload);
      if (result.error) throw result.error;
      setMessage(editing ? "تم تحديث المنتج." : "تمت إضافة المنتج.");
      reset();
      const { data: { user } } = await client.auth.getUser();
      if (user) await load(client, user.id);
    } catch (e: any) { setMessage(e?.message || "تعذر حفظ المنتج."); }
    finally { setBusy(false); }
  }
  async function remove(product: Product) {
    if (!client || !store || !window.confirm("هل تريد حذف المنتج نهائياً؟")) return;
    setBusy(true); setMessage("");
    try {
      const { error } = await client.from("products").delete().eq("id", product.id).eq("store_id", store.id);
      if (error) throw error;
      setProducts(rows => rows.filter(row => row.id !== product.id));
      if (editing === product.id) reset();
      setMessage("تم حذف المنتج.");
    } catch (e: any) { setMessage(e?.message || "تعذر حذف المنتج."); }
    finally { setBusy(false); }
  }

  if (loading) return <main className="container" style={{ padding: 48 }}>جارٍ تحميل مركز المنتجات...</main>;
  return <main className="container" style={{ maxWidth: 1050, padding: "30px 0 70px" }}>
    <Link href="/seller/dashboard" className="muted"><ArrowRight size={16} style={{ display: "inline" }} /> العودة إلى لوحة التاجر</Link>
    <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", margin: "20px 0" }}>
      <div><h1 style={{ fontSize: 34, margin: 0 }}>إدارة المنتجات</h1><p className="muted">{store?.name || "لا يوجد متجر مرتبط بالحساب"}</p></div>
      <button className="btn btn-outline" onClick={async () => { if (!client) return; const { data: { user } } = await client.auth.getUser(); if (user) await load(client, user.id); }}><RefreshCw size={16} /> تحديث</button>
    </header>
    {!store ? <section className="card" style={{ padding: 24 }}>قدّم طلب إنشاء متجر أولاً. <Link className="btn" href="/seller/apply">طلب إنشاء متجر</Link></section> :
    store.status !== "approved" ? <section className="card" style={{ padding: 24 }}>متجرك قيد المراجعة أو موقوف. ستتمكن من إدارة المنتجات بعد اعتماد المتجر.</section> :
    <>
      <form className="card" onSubmit={save} style={{ padding: 22, display: "grid", gap: 12, marginBottom: 22 }}>
        <h2 style={{ margin: 0 }}>{editing ? "تعديل المنتج" : "إضافة منتج جديد"}</h2>
        <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="اسم المنتج" className="card" style={{ padding: 13 }} />
        <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="وصف المنتج" className="card" style={{ padding: 13, minHeight: 90 }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 10 }}>
          <input required type="number" min="0" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="السعر بالجنيه السوداني" className="card" style={{ padding: 13 }} />
          <input required type="number" min="0" step="1" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} placeholder="الكمية المتاحة" className="card" style={{ padding: 13 }} />
          <select value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })} className="card" style={{ padding: 13 }}>
            <option value="">بدون تصنيف</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <input type="url" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="رابط صورة المنتج (اختياري)" className="card" style={{ padding: 13 }} />
        <label style={{ display: "flex", alignItems: "center", gap: 9 }}><input type="checkbox" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} /> نشر المنتج في السوق</label>
        <div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}><button className="btn" disabled={busy}><PackagePlus size={16} /> {busy ? "جارٍ الحفظ..." : editing ? "حفظ التعديلات" : "إضافة المنتج"}</button>{editing && <button type="button" className="btn btn-outline" onClick={reset}>إلغاء التعديل</button>}</div>
      </form>
      <section className="card" style={{ padding: 20 }}>
        <h2>منتجات متجرك ({products.length})</h2>
        {!products.length ? <p className="muted">لم تضف منتجات بعد.</p> : <div style={{ display: "grid", gap: 12 }}>
          {products.map(p => <article key={p.id} style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", borderBottom: "1px solid #e7eee8", padding: "12px 0" }}>
            {p.image_urls?.[0] ? <img src={p.image_urls[0]} alt={p.name} style={{ width: 68, height: 68, objectFit: "cover", borderRadius: 10 }} /> : <div style={{ width: 68, height: 68, borderRadius: 10, background: "#edf7ef", display: "grid", placeItems: "center" }}>🛍️</div>}
            <div style={{ flex: 1, minWidth: 150 }}><b>{p.name}</b><p className="muted" style={{ margin: "4px 0" }}>{Number(p.price).toLocaleString("en-US")} SDG · المخزون {p.stock} · {p.active ? "منشور" : "مسودة"}</p></div>
            <button className="btn btn-outline" onClick={() => edit(p)} disabled={busy}><Pencil size={15} /> تعديل</button>
            <button className="btn btn-outline" onClick={() => remove(p)} disabled={busy}><Trash2 size={15} /> حذف</button>
          </article>)}
        </div>}
      </section>
    </>}
    {message && <p role="status" className="pill" style={{ marginTop: 16 }}>{message}</p>}
  </main>;
}
