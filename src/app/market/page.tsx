"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Search, ArrowRight, ShoppingCart } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Product = {
  id: string;
  name: string;
  category_id: string | null;
  price: number;
  currency: string;
  image_urls: string[];
  stock: number;
  description: string | null;
  stores?: { name: string; slug: string } | { name: string; slug: string }[] | null;
};

type Category = { id: string; name: string; slug: string };

function readCart(): Array<{
  product_id: string;
  name: string;
  price: number;
  currency: string;
  quantity: number;
  image: string;
}> {
  try {
    const value: unknown = JSON.parse(localStorage.getItem("yosha_cart") || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export default function Market() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setSelectedCategory(new URLSearchParams(window.location.search).get("category") || "");
  }, []);

  useEffect(() => {
    let active = true;

    async function load() {
      const supabase = createClient();
      if (!supabase) {
        setMessage("إعدادات Supabase غير مكتملة. تعذر تحميل المنتجات حالياً.");
        setLoading(false);
        return;
      }

      const [productResult, categoryResult] = await Promise.all([
        supabase
          .from("products")
          .select("id,name,category_id,price,currency,image_urls,stock,description,stores(name,slug)")
          .eq("active", true)
          .gt("stock", 0)
          .order("created_at", { ascending: false }),
        supabase.from("categories").select("id,name,slug").eq("active", true).order("name"),
      ]);

      if (!active) return;

      if (productResult.error) setMessage(productResult.error.message);
      else setProducts((productResult.data || []) as Product[]);

      if (categoryResult.error) setMessage(categoryResult.error.message);
      else setCategories((categoryResult.data || []) as Category[]);

      setLoading(false);
    }

    load().catch((error: unknown) => {
      if (!active) return;
      setMessage(error instanceof Error ? error.message : "تعذر تحميل السوق.");
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    const categoryId = categories.find((category) => category.slug === selectedCategory)?.id;

    return products.filter((product) => {
      const matchesQuery =
        !normalizedQuery ||
        product.name.toLocaleLowerCase().includes(normalizedQuery) ||
        (product.description || "").toLocaleLowerCase().includes(normalizedQuery);
      const matchesCategory = !selectedCategory || product.category_id === categoryId;
      return matchesQuery && matchesCategory;
    });
  }, [products, categories, query, selectedCategory]);

  function addToCart(product: Product) {
    const cart = readCart();
    const existing = cart.find((item) => item.product_id === product.id);

    if (existing) existing.quantity += 1;
    else {
      cart.push({
        product_id: product.id,
        name: product.name,
        price: Number(product.price),
        currency: product.currency || "SDG",
        quantity: 1,
        image: product.image_urls?.[0] || "",
      });
    }

    localStorage.setItem("yosha_cart", JSON.stringify(cart));
    setMessage("أُضيف المنتج إلى السلة بنجاح.");
  }

  return (
    <main className="container" style={{ padding: "28px 0 70px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <Link href="/" className="muted">
          <ArrowRight size={16} style={{ display: "inline" }} /> الرئيسية
        </Link>
        <Link href="/cart" className="btn btn-outline">
          <ShoppingCart size={17} /> السلة
        </Link>
      </div>

      <h1 style={{ fontSize: 38, margin: "24px 0 8px" }}>اكتشف السوق</h1>
      <p className="muted">منتجات منشورة من متاجر يوشا المعتمدة.</p>

      <nav className="market-categories" aria-label="تصنيفات المنتجات">
        <Link className={!selectedCategory ? "market-chip active" : "market-chip"} href="/market">
          كل الأقسام
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            className={selectedCategory === category.slug ? "market-chip active" : "market-chip"}
            href={"/market?category=" + encodeURIComponent(category.slug)}
          >
            {category.name}
          </Link>
        ))}
      </nav>

      <label
        className="card"
        style={{ padding: 14, display: "flex", gap: 10, alignItems: "center", margin: "24px 0" }}
      >
        <Search aria-hidden="true" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="ابحث عن منتج أو وصفه"
          aria-label="البحث عن منتج"
          style={{ border: 0, outline: 0, flex: 1, minWidth: 0, background: "transparent" }}
        />
      </label>

      {loading ? (
        <p role="status">جارٍ تحميل المنتجات...</p>
      ) : filteredProducts.length > 0 ? (
        <div className="grid-products">
          {filteredProducts.map((product) => {
            const store = Array.isArray(product.stores) ? product.stores[0] : product.stores;
            return (
              <article className="card" key={product.id} style={{ overflow: "hidden" }}>
                <div
                  style={{
                    height: 190,
                    background: "#edf7ef",
                    display: "grid",
                    placeItems: "center",
                    position: "relative",
                  }}
                >
                  {product.image_urls?.[0] ? (
                    <Image
                      src={product.image_urls[0]}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <span style={{ fontSize: 56 }} aria-hidden="true">🛍️</span>
                  )}
                </div>
                <div style={{ padding: 16 }}>
                  <h2 style={{ fontSize: 17, margin: "0 0 7px" }}>{product.name}</h2>
                  <p style={{ fontSize: 19, fontWeight: 800, color: "#16834e", margin: "0 0 8px" }}>
                    {Number(product.price).toLocaleString("en-US")} {product.currency || "SDG"}
                  </p>
                  {product.description && (
                    <p className="muted" style={{ fontSize: 12, lineHeight: 1.8, margin: "0 0 9px" }}>
                      {product.description}
                    </p>
                  )}
                  <p className="muted" style={{ fontSize: 12, margin: "0 0 13px" }}>
                    {store?.name || "متجر يوشا"} · المتاح {product.stock}
                  </p>
                  <button className="btn" style={{ width: "100%" }} onClick={() => addToCart(product)}>
                    أضف إلى السلة
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="card" style={{ padding: 26, textAlign: "center" }}>
          <h2 style={{ marginTop: 0 }}>
            {query.trim() ? "لا توجد نتائج مطابقة" : "لا توجد منتجات منشورة حالياً"}
          </h2>
          <p className="muted">
            {query.trim()
              ? "جرّب كلمة بحث أخرى أو امسح البحث لعرض كل المنتجات."
              : "يمكن للتجار إضافة منتجاتهم بعد اعتماد متاجرهم."}
          </p>
          {query.trim() && (
            <button className="btn btn-outline" onClick={() => setQuery("")}>
              مسح البحث
            </button>
          )}
          {message && <p role="status" className="muted">{message}</p>}
        </div>
      )}

      {message && filteredProducts.length > 0 && (
        <p role="status" className="pill" style={{ marginTop: 18 }}>{message}</p>
      )}
    </main>
  );
}
