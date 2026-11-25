"use client";
import Link from "next/link";
import {useEffect,useState} from "react";
import {createClient} from "@/lib/supabase/client";
import {ArrowRight,Camera,Save,Store,UserRound} from "lucide-react";

export default function ProfilePage(){
  const [client,setClient]=useState<any>(null);
  const [userId,setUserId]=useState("");
  const [role,setRole]=useState("customer");
  const [name,setName]=useState("");
  const [phone,setPhone]=useState("");
  const [email,setEmail]=useState("");
  const [avatar,setAvatar]=useState("");
  const [storeId,setStoreId]=useState("");
  const [storeName,setStoreName]=useState("");
  const [storeDescription,setStoreDescription]=useState("");
  const [storeLogo,setStoreLogo]=useState("");
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState("");
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    let live=true;
    const supabase=createClient();
    if(!supabase){setMessage("إعدادات Supabase غير مكتملة.");setLoading(false);return;}
    setClient(supabase);
    (async()=>{
      const {data:{user},error}=await supabase.auth.getUser();
      if(!live)return;
      if(error||!user){location.href="/auth";return;}
      setUserId(user.id);setEmail(user.email||"");
      const {data:profile}=await supabase.from("profiles").select("full_name,phone,role,avatar_url").eq("id",user.id).maybeSingle();
      if(!live)return;
      setName(profile?.full_name||user.user_metadata?.full_name||"");
      setPhone(profile?.phone||"");setRole(profile?.role||"customer");setAvatar(profile?.avatar_url||"");
      if(profile?.role==="seller"){
        const {data:store}=await supabase.from("stores").select("id,name,description,logo_url").eq("owner_id",user.id).order("created_at",{ascending:false}).limit(1).maybeSingle();
        if(!live)return;
        if(store){setStoreId(store.id);setStoreName(store.name||"");setStoreDescription(store.description||"");setStoreLogo(store.logo_url||"");}
      }
      setLoading(false);
    })();
    return()=>{live=false;};
  },[]);

  async function upload(file:File,kind:"avatar"|"store"){
    if(!client||!userId)return;
    if(!["image/jpeg","image/png","image/webp"].includes(file.type)){setMessage("استخدم صورة JPG أو PNG أو WEBP.");return;}
    if(file.size>5*1024*1024){setMessage("حجم الصورة يجب ألا يتجاوز 5 ميجابايت.");return;}
    setBusy(true);setMessage("");
    try{
      const ext=file.name.split(".").pop()?.toLowerCase()||"jpg";
      const path=`${userId}/${kind}-${Date.now()}.${ext}`;
      const {error}=await client.storage.from("profile-media").upload(path,file,{upsert:true,contentType:file.type});
      if(error)throw error;
      const {data}=client.storage.from("profile-media").getPublicUrl(path);
      if(kind==="avatar"){
        const {error:updateError}=await client.from("profiles").update({avatar_url:data.publicUrl}).eq("id",userId);
        if(updateError)throw updateError;
        setAvatar(data.publicUrl);
      }else{
        if(!storeId)throw new Error("لا يوجد متجر مرتبط بحسابك حتى الآن.");
        const {error:updateError}=await client.from("stores").update({logo_url:data.publicUrl}).eq("id",storeId);
        if(updateError)throw updateError;
        setStoreLogo(data.publicUrl);
      }
      setMessage("تم تحديث الصورة بنجاح.");
    }catch(e){setMessage(e instanceof Error?e.message:"تعذر رفع الصورة.");}
    finally{setBusy(false);}
  }

  async function save(e:React.FormEvent){
    e.preventDefault();if(!client||!userId)return;setBusy(true);setMessage("");
    try{
      const {error}=await client.from("profiles").update({full_name:name.trim(),phone:phone.trim()}).eq("id",userId);
      if(error)throw error;
      if(role==="seller"&&storeId){
        const {error:storeError}=await client.from("stores").update({name:storeName.trim(),description:storeDescription.trim()}).eq("id",storeId);
        if(storeError)throw storeError;
      }
      await client.auth.updateUser({data:{full_name:name.trim()}});
      setMessage("تم حفظ بيانات ملفك الشخصي بنجاح.");
    }catch(e){setMessage(e instanceof Error?e.message:"تعذر حفظ البيانات.");}
    finally{setBusy(false);}
  }

  if(loading)return <main className="container" style={{padding:50}}>جارٍ تحميل ملفك الشخصي...</main>;
  return <main className="container" style={{maxWidth:820,padding:"30px 0 70px"}}>
    <Link href={role==="seller"?"/seller/dashboard":"/account"} className="muted" style={{display:"inline-flex",alignItems:"center",gap:8}}><ArrowRight size={17}/> العودة إلى {role==="seller"?"لوحة التاجر":"مركز العميل"}</Link>
    <section className="card" style={{padding:"clamp(20px,4vw,34px)",marginTop:18}}>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
        <div className="pill" style={{display:"inline-flex",alignItems:"center",gap:7}}>{role==="seller"?<Store size={15}/>:<UserRound size={15}/>} {role==="seller"?"ملف التاجر":"ملفي الشخصي"}</div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:18,flexWrap:"wrap",marginBottom:25}}>
        <div style={{width:94,height:94,borderRadius:"50%",overflow:"hidden",background:"#e8f5ec",display:"grid",placeItems:"center",border:"3px solid #d7eddd"}}>
          {avatar?<img src={avatar} alt="الصورة الشخصية" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<UserRound size={42} color="#28784b"/>}
        </div>
        <div><b style={{display:"block",fontSize:18}}>{name||"صاحب الحساب"}</b><span className="muted" style={{fontSize:13}}>{email}</span><div style={{marginTop:10}}><label className="btn btn-outline" style={{cursor:"pointer",padding:"9px 14px"}}><Camera size={16}/> تغيير الصورة<input type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={e=>e.target.files?.[0]&&upload(e.target.files[0],"avatar")}/></label></div></div>
      </div>
      <form onSubmit={save} style={{display:"grid",gap:14}}>
        <label style={{display:"grid",gap:7,fontWeight:700}}>الاسم الكامل<input required value={name} onChange={e=>setName(e.target.value)} className="card" style={{padding:13}}/></label>
        <label style={{display:"grid",gap:7,fontWeight:700}}>البريد الإلكتروني<input value={email} readOnly className="card" style={{padding:13,background:"#f6f8f6",color:"#718078"}}/></label>
        <label style={{display:"grid",gap:7,fontWeight:700}}>رقم الهاتف<input value={phone} onChange={e=>setPhone(e.target.value)} className="card" style={{padding:13}} placeholder="أدخل رقم هاتفك"/></label>
        {role==="seller"&&<section style={{borderTop:"1px solid #e6eee8",paddingTop:22,marginTop:8,display:"grid",gap:14}}>
          <h2 style={{fontSize:21,margin:0}}>بيانات متجرك</h2>
          <div style={{display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
            <div style={{width:72,height:72,borderRadius:18,overflow:"hidden",background:"#e8f5ec",display:"grid",placeItems:"center"}}>{storeLogo?<img src={storeLogo} alt="شعار المتجر" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<Store size={30}/>}</div>
            <label className="btn btn-outline" style={{cursor:"pointer"}}><Camera size={16}/> تغيير شعار المتجر<input type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={e=>e.target.files?.[0]&&upload(e.target.files[0],"store")}/></label>
          </div>
          {storeId?<><label style={{display:"grid",gap:7,fontWeight:700}}>اسم المتجر<input required value={storeName} onChange={e=>setStoreName(e.target.value)} className="card" style={{padding:13}}/></label><label style={{display:"grid",gap:7,fontWeight:700}}>نبذة عن المتجر<textarea value={storeDescription} onChange={e=>setStoreDescription(e.target.value)} className="card" style={{padding:13,minHeight:100}}/></label></>:<p className="muted">حساب التاجر لم يرتبط بمتجر معتمد بعد. ستظهر بيانات المتجر هنا بعد اعتماد طلبك.</p>}
        </section>}
        <button className="btn" disabled={busy} style={{justifySelf:"start",marginTop:8}}><Save size={17}/>{busy?"جارٍ الحفظ...":"حفظ التعديلات"}</button>
      </form>
      {message&&<p role="status" className="pill" style={{display:"inline-flex",marginTop:18,whiteSpace:"normal"}}>{message}</p>}
    </section>
  </main>;
}
