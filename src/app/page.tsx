"use client";
import Link from "next/link";
import { useState } from "react";
import { ShieldCheck, Truck, Heart, ArrowLeft, Menu, Sparkles, ShoppingBag } from "lucide-react";

const categories=[
  {name:"ملابس رجالية",slug:"mens-fashion",image:"https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=900&q=80",desc:"إطلالات رجالية يومية ورسمية"},
  {name:"ملابس نسائية",slug:"womens-fashion",image:"https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80",desc:"أزياء وإطلالات نسائية"},
  {name:"الأحذية والحقائب",slug:"shoes-bags",image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",desc:"أحذية وحقائب لكل المناسبات"},
  {name:"الهواتف والإلكترونيات",slug:"electronics",image:"https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80",desc:"هواتف وأجهزة وإكسسوارات"},
  {name:"الكمبيوتر والألعاب",slug:"computers-gaming",image:"https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80",desc:"لابتوبات وملحقات وألعاب"},
  {name:"المنزل والمطبخ",slug:"home-kitchen",image:"https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=900&q=80",desc:"أثاث وأدوات منزلية"},
  {name:"الجمال والعناية",slug:"beauty-care",image:"https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=80",desc:"عناية شخصية ومستحضرات تجميل"},
  {name:"الأطفال والألعاب",slug:"kids-toys",image:"https://images.unsplash.com/photo-1503919005314-30d93d07d823?auto=format&fit=crop&w=900&q=80",desc:"ملابس وألعاب ومستلزمات الأطفال"},
  {name:"الرياضة واللياقة",slug:"sports-fitness",image:"https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80",desc:"معدات وملابس رياضية"},
  {name:"الساعات والإكسسوارات",slug:"watches-accessories",image:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",desc:"ساعات وإكسسوارات أنيقة"},
  {name:"السيارات وقطع الغيار",slug:"auto-parts",image:"https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80",desc:"إكسسوارات وقطع غيار"},
  {name:"الكتب والمستلزمات",slug:"books-stationery",image:"https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=900&q=80",desc:"كتب وأدوات مكتبية ودراسية"}
];

export default function Home(){
  const [menu,setMenu]=useState(false);
  const [entered,setEntered]=useState(false);
  const [delivery,setDelivery]=useState(false);

  return <>
    {!entered && <section className={`cinematic-intro ${delivery ? "delivery-mode" : ""}`} aria-label="مرحباً بك في يوشا">
      <div className="intro-noise" /><div className="intro-stars"><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/></div>
      <div className="intro-aurora intro-aurora-one"/><div className="intro-aurora intro-aurora-two"/>
      <div className="intro-content">
        <div className="intro-brand-emblem"><span className="emblem-orbit orbit-a"/><span className="emblem-orbit orbit-b"/><img src="/ys-logo.svg" alt="شعار YOSHA" /></div>
        <div className="intro-kicker"><span/> THE WORLD OF POSSIBILITIES <span/></div>
        <h1 className="intro-wordmark" aria-label="YOSHA">YOSHA</h1>
        <p className="intro-arabic">عالمك كله... في مكان واحد</p>
        <p className="intro-description">اكتشف عالماً من الخيارات، وصمّم تجربتك بطريقتك.</p>
        <div className="intro-brand-stage" aria-hidden="true">
          <div className="stage-halo"/><div className="stage-platform platform-back"/>
          <div className="stage-platform platform-front"/>
          <div className="stage-word">YOSHA</div>
          <div className="stage-caption">YOUR WORLD · ONE DESTINATION</div>
          <span className="stage-spark spark-one"/><span className="stage-spark spark-two"/><span className="stage-spark spark-three"/>
        </div>
        {!delivery ? <button className="intro-enter" onClick={()=>setDelivery(true)}><ShoppingBag size={18}/> ادخل عالم يوشا <ArrowLeft size={18}/></button> : <div className="delivery-message"><span/> طلبك في الطريق... أهلاً بك في يوشا</div>}
        <div className="intro-footnote">YOSHA STORE <span>•</span> YOUR WORLD, ONE STORE</div>
      </div>
      {delivery && <div className="delivery-road" aria-hidden="true"><div className="road-line"/><div className="delivery-bike" onAnimationEnd={()=>setEntered(true)}>
        <div className="bike-rider"><i className="rider-helmet"/><i className="rider-body"/><i className="rider-arm"/><i className="rider-leg"/></div>
        <div className="bike-frame"/><div className="bike-fairing"><b>YOSHA</b></div>
        <div className="bike-wheel bike-wheel-one"/><div className="bike-wheel bike-wheel-two"/>
        <div className="bike-light"/><div className="bike-box">YOSHA</div>
      </div></div>}
      <div className="intro-bottom-glow"/>
    </section>}
    <main>
      <header className="container site-header">
        <Link href="/" className="site-logo"><img src="/ys-logo.svg" alt="YS" width="36" height="36"/> <span className="site-wordmark">YOSHA</span></Link>
        <nav className="desktop-nav"><a href="#categories">التصنيفات</a><a href="#products">اكتشف المنتجات</a><Link href="/seller">افتح متجرك</Link></nav>
        <div className="header-actions"><Link className="btn btn-outline" href="/auth">دخول / حساب جديد</Link><button className="btn menu-button" aria-label="القائمة" onClick={()=>setMenu(!menu)}><Menu size={18}/></button></div>
      </header>
      {menu&&<div className="container card mobile-menu"><Link href="/seller">مركز البائعين</Link><Link href="/account">حسابي</Link><Link href="/admin">الإدارة</Link></div>}
      <section className="container hero" style={{padding:"clamp(30px,7vw,78px)",display:"grid",gridTemplateColumns:"1.15fr .85fr",gap:28,alignItems:"center",marginTop:12}}>
        <div><span className="pill"><Sparkles size={13} style={{display:"inline",verticalAlign:"middle"}}/> تجربة تسوق جديدة</span>
          <h1 style={{fontFamily:"Arial Black, Arial, sans-serif",fontSize:"clamp(38px,6vw,68px)",lineHeight:1.35,margin:"20px 0",fontWeight:900,letterSpacing:"-1.5px",color:"#ffffff",textShadow:"0 2px 10px rgba(13,55,33,.38)"}}>كل ما تبحث عنه<br/><span style={{color:"#153f2b",textShadow:"0 1px 5px rgba(13,55,33,.12)"}}>في مكان واحد.</span></h1>
          <p className="muted" style={{fontSize:18,lineHeight:1.9,maxWidth:560}}>اكتشف منتجات مميزة من متاجر متعددة، وتسوق بسهولة وأمان مع تجربة مصممة لتكبر معك.</p>
          <div style={{display:"flex",gap:12,flexWrap:"wrap",marginTop:26}}><a className="btn" href="#products">ابدأ التسوق <ArrowLeft size={17}/></a><Link className="btn btn-outline" href="/seller">أنشئ متجرك</Link></div>
          <div className="trust-row"><span><ShieldCheck size={17}/> تجربة آمنة</span><span><Truck size={17}/> خيارات توصيل</span><span><Heart size={17}/> متاجر متنوعة</span></div>
        </div>
        <div className="glass market-showcase"><div className="showcase-orbit"><div className="showcase-bag">🛍️</div><span className="showcase-dot dot-a"/><span className="showcase-dot dot-b"/></div><div className="card showcase-label"><b>YOSHA MARKET</b><div className="muted" style={{fontSize:12,marginTop:4}}>اكتشف • اختَر • استمتع</div></div><div className="pill showcase-tag">YOUR WORLD, ONE STORE</div></div>
      </section>
      <section className="container section-block" id="categories"><div className="section-heading"><div><div className="muted">تصفح أقسام السوق</div><h2>تسوّق حسب الفئة</h2><p className="muted">اختَر القسم وشاهد المنتجات والمتاجر التي تبيع ما تبحث عنه.</p></div></div>
        <div className="category-grid category-photo-grid">{categories.map(c=><Link key={c.slug} href={"/market?category="+c.slug} className="card category-photo-card"><div className="category-photo"><img src={c.image} alt={c.name} loading="lazy"/></div><div className="category-photo-copy"><b>{c.name}</b><span>{c.desc}</span><small>استكشف القسم <ArrowLeft size={14}/></small></div></Link>)}</div>
      </section>
      <section className="container section-block" id="products" aria-labelledby="products-title">
        <div className="card" style={{padding:"clamp(24px,5vw,42px)",display:"flex",alignItems:"center",justifyContent:"space-between",gap:24,flexWrap:"wrap",background:"linear-gradient(120deg,#f0faf2,#ffffff 68%)"}}>
          <div style={{maxWidth:620}}>
            <div className="muted">سوق يوشا في انتظارك</div>
            <h2 id="products-title" style={{fontSize:"clamp(25px,4vw,36px)",margin:"9px 0",fontWeight:900}}>اكتشف المنتجات التي تناسبك</h2>
            <p className="muted" style={{lineHeight:1.9,margin:0}}>تصفح المنتجات المتاحة من المتاجر المعتمدة، قارن الأسعار، وأضف اختياراتك إلى سلة التسوق بسهولة.</p>
          </div>
          <Link href="/market" className="btn">تصفح كل المنتجات <ArrowLeft size={17}/></Link>
        </div>
      </section>
      <section className="container seller-invite"><div><div className="muted">لديك منتجات تريد بيعها؟</div><h2>اعرض منتجاتك في سوق يوشا</h2><p className="muted">افتح متجرك، أضف صور منتجاتك، واستقبل طلبات العملاء من مكان واحد.</p></div><Link href="/seller" className="btn">ابدأ البيع الآن <ArrowLeft size={17}/></Link></section>
      <footer className="site-footer"><div className="container footer-inner"><div><b className="footer-brand">YOSHA STORE</b><p>سوق واحد. فرص بلا حدود.</p></div><div className="footer-links"><Link href="/seller">مركز البائعين</Link><Link href="/auth">حسابي</Link><Link href="/support">الدعم</Link></div><small>© {new Date().getFullYear()} YOSHA</small></div></footer>
    </main>
  </>;
}
