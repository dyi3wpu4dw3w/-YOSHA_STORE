"use client";
import Link from "next/link";
import {useEffect,useState} from "react";
import {createClient} from "@/lib/supabase/client";
import {Home,Package,Heart,MapPin,Wallet,LogOut,UserRound,ArrowRight} from "lucide-react";

const sections=[
  {id:"overview",label:"مركز العميل",icon:UserRound},
  {id:"orders",label:"طلباتي",icon:Package},
  {id:"favorites",label:"المفضلة",icon:Heart},
  {id:"addresses",label:"عناويني",icon:MapPin},
  {id:"wallet",label:"المحفظة",icon:Wallet},
];
const descriptions:Record<string,string>={
  overview:"تابع حسابك وخدماتك من مكان واحد.",
  orders:"ستظهر طلباتك وحالات الشحن هنا بعد إتمام أول عملية شراء.",
  favorites:"المنتجات التي تحفظها في المفضلة ستجدها هنا.",
  addresses:"يمكنك متابعة عناوين التوصيل المحفوظة هنا.",
  wallet:"رصيدك وحركات محفظتك ستظهر هنا عند تفعيل خدمة المحفظة."
};
export default function Account(){
  const [tab,setTab]=useState("overview");
  const [user,setUser]=useState<{email?:string;name?:string}|null>(null);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");
  useEffect(()=>{const requested=new URLSearchParams(window.location.search).get("tab")||"overview";setTab(sections.some(x=>x.id===requested)?requested:"overview");},[]);
  useEffect(()=>{
    let active=true;
    const supabase=createClient();
    if(!supabase){setError("تعذر الاتصال بخدمة الحساب حالياً.");setLoading(false);return;}
    supabase.auth.getUser().then(({data,error})=>{
      if(!active)return;
      if(error||!data.user){window.location.href="/auth";return;}
      setUser({email:data.user.email,name:data.user.user_metadata?.full_name});
      setLoading(false);
    });
    return()=>{active=false;};
  },[]);
  async function logout(){
    const supabase=createClient();
    if(supabase)await supabase.auth.signOut();
    window.location.href="/";
  }
  const current=sections.find(x=>x.id===tab)||sections[0];
  return <main className="container" style={{padding:"28px 0 60px"}}>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexWrap:"wrap",marginBottom:22}}>
      <Link href="/" className="btn btn-outline"><Home size={17}/> الرئيسية</Link>
      <Link href="/" className="site-logo"><img src="/ys-logo.svg" alt="YS" width="34" height="34"/><span className="site-wordmark">YOSHA</span></Link>
    </div>
    {loading?<section className="card" style={{padding:30,textAlign:"center"}}>جارٍ تحميل حسابك...</section>:error?<section className="card" style={{padding:30}}>{error}</section>:<div style={{display:"grid",gridTemplateColumns:"minmax(210px,260px) 1fr",gap:20,alignItems:"start"}}>
      <aside className="card" style={{padding:16}}>
        <div style={{padding:"10px 8px 18px",borderBottom:"1px solid #edf1eb",marginBottom:10}}>
          <div className="pill" style={{display:"inline-flex",marginBottom:10}}>مركز العميل</div>
          <b style={{display:"block",fontSize:16}}>{user?.name||"مرحباً بك"}</b>
          <span className="muted" style={{fontSize:12,wordBreak:"break-word"}}>{user?.email}</span>
        </div>
        {sections.map(item=>{const Icon=item.icon;return <Link key={item.id} href={item.id==="overview"?"/account":"/account?tab="+item.id} style={{display:"flex",alignItems:"center",gap:10,padding:12,borderRadius:12,background:tab===item.id?"#eaf5ed":"transparent",color:tab===item.id?"#17683c":"#34483b",fontWeight:700,fontSize:14}}><Icon size={18}/>{item.label}</Link>;})}
        <button onClick={logout} className="drawer-link" style={{width:"100%",border:0,background:"transparent",cursor:"pointer",marginTop:10}}><LogOut size={18}/> تسجيل الخروج</button>
      </aside>
      <section className="card" style={{padding:"clamp(22px,4vw,36px)",minHeight:280}}>
        <div className="muted" style={{fontSize:13}}>حساب YOSHA</div>
        <h1 style={{fontSize:28,margin:"8px 0 10px"}}>{current.label}</h1>
        <p className="muted" style={{lineHeight:2,margin:0}}>{descriptions[tab]}</p>
        {tab==="overview"&&<div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:24}}><Link href="/market" className="btn">ابدأ التسوق <ArrowRight size={16}/></Link><Link href="/support" className="btn btn-outline">تواصل مع الدعم</Link></div>}
      </section>
    </div>}
    <style jsx>{`@media(max-width:680px){main>div+div{grid-template-columns:1fr!important}}`}</style>
  </main>;
}
