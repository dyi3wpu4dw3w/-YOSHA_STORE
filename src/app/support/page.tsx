import Link from "next/link";
import { Mail, Facebook, Headset } from "lucide-react";

export default function Support(){
  return <main className="container" style={{padding:"40px 0",minHeight:"65vh"}}>
    <Link href="/">← الرئيسية</Link>
    <div style={{maxWidth:720,margin:"42px auto",padding:"clamp(24px,5vw,42px)",border:"1px solid #e3eee6",borderRadius:24,background:"linear-gradient(145deg,#f3fbf5,#fff)"}}>
      <div style={{width:54,height:54,borderRadius:16,display:"grid",placeItems:"center",background:"#e2f4e7",color:"#187344"}}><Headset size={27}/></div>
      <h1 style={{margin:"18px 0 8px"}}>مركز المساعدة والدعم</h1>
      <p className="muted" style={{lineHeight:1.9}}>نحن هنا لمساعدتك. تواصل مع فريق يوشا عبر البريد الإلكتروني أو تابع صفحتنا على فيسبوك.</p>
      <a href="mailto:wsfalkasr@gmail.com" style={{display:"flex",alignItems:"center",gap:12,padding:16,marginTop:22,border:"1px solid #dceee0",borderRadius:14,background:"#fff",color:"#176b3d",textDecoration:"none"}}>
        <Mail size={22}/><span><b style={{display:"block"}}>البريد الإلكتروني</b><span>wsfalkasr@gmail.com</span></span>
      </a>
      <a href="https://www.facebook.com/share/1H39aMdw8v/" target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",gap:12,padding:16,marginTop:12,border:"1px solid #dceee0",borderRadius:14,background:"#fff",color:"#176b3d",textDecoration:"none"}}>
        <Facebook size={22}/><span><b style={{display:"block"}}>صفحة يوشا على فيسبوك</b><span>تابعنا وتواصل معنا</span></span>
      </a>
    </div>
  </main>;
}