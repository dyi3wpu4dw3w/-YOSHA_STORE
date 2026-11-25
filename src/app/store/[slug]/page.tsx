"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ArrowRight, ShoppingBag, Store } from "lucide-react";

type StoreRow = { id: string; name: string; slug: string; description: string | null; logo_url: string | null };
type ProductRow = { id: string; name: string; price: number; currency: string; image_urls: string[]; description: string | null; stock: number };

export default function PublicStorePage() {
  const params = useParams<{ slug: string }>();
  const [store, setStore] = useState<StoreRow | null>(null);
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      const supabase = createClient();
      if (!supabase) {
        setMessage("تعذر الاتصال بالمتجر حالياً.");
        setLoading(false);
        return;
      }
      const { data: found, error } = await supabase
        .from("stores")
        .select("id,name,slug,description,logo_url")
        .eq("slug", params.slug)
        .eq("status", "approved")
        .maybeSingle();
      if (error) throw error;
      if (!active) return;
      if (!found) {
        setMessage("هذا المتجر غير متاح أو لم تتم الموافقة عليه بعد.");
        setLoading(false);
        return;
      }
      setStore(found as StoreRow);
      const { data: items, error: productsError } = await supabase
        .from("products")
        .select("id,name,price,currency,image_urls,description,stock")
        .eq("store_id", found.id)
        .eq("active", true)
        .gt("stock", 0)
        .order("created_at", { ascending: false });
      if (productsError) throw productsError;
      if (!active) return;
      setProducts((items || []) as ProductRow[]);
      setLoading(false);
    }
    load().catch((error: unknown) => {
      if (!active) return;
      setMessage(error instanceof Error ? error.message : "حدث خطأ أثناء تحميل المتجر.");
      setLoading(false);
    });
    return () => { active = false; };
  }, [params.slug]);

  function addToCart(product: ProductRow) {
    try {
      const raw = localStorage.getItem("yosha_cart") || "[]";
      const cart = JSON.parse(raw);
      const existing = Array.isArray(cart) ? cart.find((item: { product_id?: string }) => item.product_id === product.id) : null;
      if (existing) existing.quantity += 1;
      else cart.push({ product_id: product.id, name: product.name, price: Number(product.price), currency: product.currency || "SDG", quantity: 1, image: product.image_urls?.[0] || "" });
      localStorage.setItem("yosha_cart", JSON.stringify(cart));
      setMessage("أُضيف المنتج إلى السلة.");
    } catch {
      setMessage("تعذرت إضافة المنتج إلى السلة.");
    }
  }

  return (
    <main className="container" style={{ padding: "30px 0 70px" }}>
      <Link href="/market" className="muted"><ArrowRight size={16} style={{ display: "inline" }} /> سوق يوشا</Link>
      {loading ? <p role="status" style={{ padding: 40 }}>جارٍ تحميل المتجر...</p> : store ? <>
        <header className="card" style={{ padding: 24, margin: "22px 0", display: "flex", alignItems: "center", gap: 16 }}>
          {store.logo_url ? <img src={store.logo_url} alt={store.name} style={{ width: 76, height: 76, borderRadius: 18, objectFit: "cover" }} /> : <span style={{ width: 76, height: 76, borderRadius: 18, background: "#eaf6ed", display: "grid", placeItems: "center" }}><Store size={34} /></span>}
          <div><p className="muted" style={{ margin: 0 }}>متجر على YOSHA</p><h1 style={{ margin: "5px 0", fontSize: 30 }}>{store.name}</h1><p className="muted" style={{ margin: 0 }}>{store.description || "تصفح منتجات المتجر واطلب بسهولة."}</p></div>
        </header>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <h2 style={{ fontSize: 24 }}>منتجات المتجر</h2>
          <Link href="/cart" className="btn btn-outline"><ShoppingBag size={17} /> سلة التسوق</Link>
        </div>
        {products.length ? <div className="grid-products">{products.map(product => <article className="card" key={product.id} style={{ overflow: "hidden" }}>
          <div style={{ height: 190, background: "#edf7ef", display: "grid", placeItems: "center" }}>
            {product.image_urls?.[0] ? <img src={product.image_urls[0]} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: 52 }}>🛍️</span>}
          </div>
          <div style={{ padding: 16 }}>
            <h3 style={{ margin: "0 0 8px", fontSize: 17 }}>{product.name}</h3>
            <p style={{ color: "#16834e", fontSize: 19, fontWeight: 800 }}>{Number(product.price).toLocaleString("en-US")} {product.currency || "SDG"}</p>
            {product.description && <p className="muted" style={{ fontSize: 12, lineHeight: 1.8 }}>{product.description}</p>}
            <button className="btn" style={{ width: "100%" }} onClick={() => addToCart(product)}>أضف إلى السلة</button>
          </div>
        </article>)}</div> : <div className="card" style={{ padding: 26, textAlign: "center" }}><p>لا توجد منتجات منشورة في هذا المتجر حالياً.</p></div>}
        {message && <p role="status" className="pill" style={{ marginTop: 18 }}>{message}</p>}
      </> : <div className="card" style={{ padding: 28, marginTop: 22, textAlign: "center" }}><h1>المتجر غير متاح</h1><p className="muted">{message}</p><Link href="/market" className="btn">العودة إلى السوق</Link></div>}
    </main>
  );
}
