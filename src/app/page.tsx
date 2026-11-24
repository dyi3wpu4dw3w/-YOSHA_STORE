"use client";
import Link from "next/link";
import { useState } from "react";
import { Search, ShieldCheck, Truck, Heart, ArrowLeft, Menu, Sparkles, ShoppingBag } from "lucide-react";

const categories=["الإلكترونيات","الأزياء","المنزل والمطبخ","الجمال والعناية","الرياضة","الأطفال"];
const demos=[["سماعات لاسلكية","إلكترونيات","48,000"],["حقيبة يومية أنيقة","أزياء","35,000"],["مصباح مكتبي عصري","المنزل","29,500"],["ساعة ذكية رياضية","إلكترونيات","89,000"]];

export default function Home(){
  const [q,setQ]=useState("");
  const [menu,setMenu]=useState(false);
  const [entered,setEntered]=useState(false);\n  const [delivery,setDelivery]=useState(false);

  return <>
    {!entered && <section className={`cinematic-intro ${delivery ? "delivery-mode" : ""}`} aria-label="مرحباً بك في يوشا">
      <div className="intro-noise" /><div className="intro-stars"><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/></div>
      <div className="intro-aurora intro-aurora-one"/><div className="intro-aurora intro-aurora-two"/>
      <div className="intro-content">
        <div className="intro-orb"><div className="orb-core"><span>Y</span></div><div className="orb-ring orb-ring-one"/><div className="orb-ring orb-ring-two"/><div className="orb-ring orb-ring-three"/><span className="orb-satellite"/></div>
        <div className="intro-kicker"><span/> THE WORLD OF POSSIBILITIES <span/></div><h1 className="intro-wordmark">YOSHA<span>.</span></h1>
        <p className="intro-arabic">عالمك كله... في مكان واحد</p><p className="intro-description">اكتشف. اختَر. استمتع.</p>
        <div className="shopping-scene" aria-hidden="true"><div className="scene-floor"/>
          <div className="shopper shopper-one"><div className="shopper-head"/><div className="shopper-hair"/><div className="shopper-body"/><div className="shopper-arm arm-one"/><div className="shopper-arm arm-two"/><div className="shopper-leg leg-one"/><div className="shopper-leg leg-two"/><div className="shopper-bag">Y</div></div>
          <div className="shopper shopper-two"><div className="shopper-head"/><div className="shopper-hair"/><div className="shopper-body"/><div className="shopper-arm arm-one"/><div className="shopper-arm arm-two"/><div className="shopper-leg leg-one"/><div className="shopper-leg leg-two"/><div className="shopper-bag">✦</div></div>
          <div className="shopper shopper-three"><div className="shopper-head"/><div className="shopper-hair"/><div className="shopper-body"/><div className="shopper-arm arm-one"/><div className="shopper-arm arm-two"/><div className="shopper-leg leg-one"/><div className="shopper-leg leg-two"/><div className="shopper-bag">Y</div></div>
          <div className="floating-cart">🛒</div><div className="floating-box">✧</div>
        </div>
        {!delivery ? <button className="intro-enter" onClick={()=>setDelivery(true)}><ShoppingBag size={18}/> ادخل عالم يوشا <ArrowLeft size={18}/></button> : <div className="delivery-message"><span/> طلبك في الطريق... أهلاً بك في يوشا</div>}
        <div className="intro-footnote">YOSHA STORE <span>•</span> YOUR WORLD, ONE STORE</div>
      </div>
      {delivery && <div className="delivery-road" aria-hidden="true"><div className="road-line"/><div className="delivery-van" onAnimationEnd={()=>setEntered(true)}>
        <div className="van-shadow"/><div className="van-body"><span className="van-logo">YOSHA<span>.</span></span><span className="van-caption">DELIVERY</span></div><div className="van-cabin"><i/></div><div className="van-wheel wheel-one"/><div className="van-wheel wheel-two"/><div className="van-light"/>
      </div></div>}
      <div className="intro-bottom-glow"/>
    </section>}
    <main>
      <header className="container site-header">
        <Link href="/" className="site-logo">YOSHA<span>.</span></Link>
        <nav className="desktop-nav"><a href="#categories">التصنيفات</a><a href="#products">اكتشف المنتجات</a><Link href="/seller">افتح متجرك</Link></nav>
        <div className="header-actions"><Link className="btn btn-outline" href="/auth">دخول / حساب جديد</Link><button className="btn menu-button" aria-label="القائمة" onClick={()=>setMenu(!menu)}><Menu size={18}/></button></div>
      </header>
      {menu&&<div className="container card mobile-menu"><Link href="/seller">مركز البائعين</Link><Link href="/account">حسابي</Link><Link href="/admin">الإدارة</Link></div>}
      <section className="container hero" style={{padding:"clamp(30px,7vw,78px)",display:"grid",gridTemplateColumns:"1.15fr .85fr",gap:28,alignItems:"center",marginTop:12}}>
        <div><span className="pill"><Sparkles size={13} style={{display:"inline",verticalAlign:"middle"}}/> تجربة تسوق جديدة</span>
          <h1 style={{fontSize:"clamp(38px,6vw,68px)",lineHeight:1.08,margin:"20px 0",fontWeight:900}}>كل ما تبحث عنه،<br/><span style={{color:"#22a06b"}}>في مكان واحد.</span></h1>
          <p className="muted" style={{fontSize:18,lineHeight:1.9,maxWidth:560}}>اكتشف منتجات مميزة من متاجر متعددة، وتسوق بسهولة وأمان مع تجربة مصممة لتكبر معك.</p>
          <div style={{display:"flex",gap:12,flexWrap:"wrap",marginTop:26}}><a className="btn" href="#products">ابدأ التسوق <ArrowLeft size={17}/></a><Link className="btn btn-outline" href="/seller">أنشئ متجرك</Link></div>
          <div className="trust-row"><span><ShieldCheck size={17}/> تجربة آمنة</span><span><Truck size={17}/> خيارات توصيل</span><span><Heart size={17}/> متاجر متنوعة</span></div>
        </div>
        <div className="glass market-showcase"><div className="showcase-orbit"><div className="showcase-bag">🛍️</div><span className="showcase-dot dot-a"/><span className="showcase-dot dot-b"/></div><div className="card showcase-label"><b>YOSHA MARKET</b><div className="muted" style={{fontSize:12,marginTop:4}}>اكتشف • اختَر • استمتع</div></div><div className="pill showcase-tag">YOUR WORLD, ONE STORE</div></div>
      </section>
      <section className="container section-block" id="categories"><div className="section-heading"><div><div className="muted">تسوق حسب اهتمامك</div><h2>التصنيفات الرئيسية</h2></div></div>
        <div className="category-grid">{categories.map((c,i)=><Link key={c} href={"/market?category="+encodeURIComponent(c)} className="card category-card"><span>{["💻","👕","🏡","✨","⚽","🧸"][i]}　{c}</span><ArrowLeft size={17}/></Link>)}</div>
      </section>
      <section className="container products-section" id="products"><div className="products-heading"><div><div className="muted">اختيارات تستحق التجربة</div><h2>منتجات مختارة</h2></div><label className="card search-box"><Search size={17}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="ابحث عن منتج..."/></label></div>
        <div className="grid-products">{demos.filter(p=>p[0].includes(q)).map((p,i)=><article className="card product-card" key={p[0]}><div className="product-visual">{["🎧","👜","💡","⌚"][i]}</div><div className="product-info"><span className="pill">{p[1]}</span><h3>{p[0]}</h3><b>{p[2]} ج.س</b><div style={{marginTop:14}}><Link className="btn btn-outline product-link" href="/market">عرض المنتجات</Link></div></div></article>)}</div>
        <p className="muted demo-note">المنتجات الظاهرة هنا أمثلة تصميمية أولية؛ المنتجات الفعلية تُحمّل من قاعدة البيانات بعد إعداد Supabase وإضافة بيانات المتاجر.</p>
      </section>
      <footer className="site-footer"><div className="container footer-inner"><div><b className="footer-brand">YOSHA STORE</b><p>سوق واحد. فرص بلا حدود.</p></div><div className="footer-links"><Link href="/seller">مركز البائعين</Link><Link href="/auth">حسابي</Link><Link href="/support">الدعم</Link></div><small>© {new Date().getFullYear()} YOSHA</small></div></footer>
    </main>
  </>;
}
