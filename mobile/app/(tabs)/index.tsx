import {useCallback,useEffect,useMemo,useState} from "react";
import {ActivityIndicator,FlatList,Image,RefreshControl,ScrollView,StyleSheet,Text,TextInput,TouchableOpacity,View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {supabase} from "../../lib/supabase";
import {Yosha} from "../../theme";
import Brand from "../../components/Brand";
type Product={id:string;name:string;price:number;currency:string;image_urls:string[];description:string|null};
type Store={id:string;name:string;slug:string};
export default function HomeScreen(){
 const [products,setProducts]=useState<Product[]>([]),[stores,setStores]=useState<Store[]>([]);
 const [loading,setLoading]=useState(true),[error,setError]=useState(""),[search,setSearch]=useState("");
 const load=useCallback(async()=>{setError("");const [p,s]=await Promise.all([
  supabase.from("products").select("id,name,price,currency,image_urls,description").eq("active",true).order("created_at",{ascending:false}).limit(40),
  supabase.from("stores").select("id,name,slug").eq("status","approved").limit(16)
 ]);if(p.error)setError(p.error.message);else setProducts((p.data||[]) as Product[]);if(!s.error)setStores((s.data||[]) as Store[]);setLoading(false);},[]);
 useEffect(()=>{load();},[load]);
 const visible=useMemo(()=>products.filter(p=>p.name.toLowerCase().includes(search.trim().toLowerCase())),[products,search]);
 return <FlatList style={st.page} contentContainerStyle={st.content} keyboardShouldPersistTaps="handled"
  refreshControl={<RefreshControl refreshing={loading} onRefresh={()=>{setLoading(true);load();}} tintColor={Yosha.colors.primary}/>}
  ListHeaderComponent={<View>
   <View style={st.top}><Brand compact/><TouchableOpacity style={st.bell}><Ionicons name="notifications-outline" size={21} color={Yosha.colors.forest}/></TouchableOpacity></View>
   <View style={st.hero}><View style={st.heroGlow}/><Text style={st.eyebrow}>YOUR WORLD, YOUR MARKET</Text><Text style={st.heroTitle}>كل ما تحبّه،{ "\n"}في مكان واحد.</Text><Text style={st.heroCopy}>اكتشف منتجات مميزة من متاجر YOSHA المتنوعة.</Text><View style={st.heroPill}><Ionicons name="shield-checkmark" color="#D8F7E1" size={14}/><Text style={st.heroPillText}>تجربة تسوّق موثوقة وسهلة</Text></View></View>
   <View style={st.search}><Ionicons name="search" size={19} color={Yosha.colors.muted}/><TextInput value={search} onChangeText={setSearch} placeholder="ابحث عن منتج..." placeholderTextColor="#8AA092" style={st.searchInput}/>{search.length>0?<TouchableOpacity onPress={()=>setSearch("")}><Ionicons name="close-circle" size={18} color={Yosha.colors.muted}/></TouchableOpacity>:null}</View>
   <View style={st.sectionHead}><Text style={st.sectionTitle}>متاجر تستحق الاكتشاف</Text><Text style={st.sectionHint}>تسوّق من متاجرك المفضلة</Text></View>
   <FlatList horizontal showsHorizontalScrollIndicator={false} data={stores} keyExtractor={x=>x.id} contentContainerStyle={{gap:10,paddingBottom:6}} renderItem={({item})=><View style={st.store}><View style={st.storeMark}><Text style={st.storeInitial}>{item.name.slice(0,1)}</Text></View><Text style={st.storeName} numberOfLines={1}>{item.name}</Text><Text style={st.storeCaption}>متجر معتمد</Text></View>} ListEmptyComponent={<Text style={st.empty}>ستظهر المتاجر المعتمدة هنا.</Text>}/>
   <View style={st.sectionHead}><View><Text style={st.sectionTitle}>{search?"نتائج البحث":"وصل حديثاً"}</Text><Text style={st.sectionHint}>اختيارات جديدة من سوق YOSHA</Text></View><View style={st.countPill}><Text style={st.countText}>{visible.length} منتج</Text></View></View>
   {error?<Text style={st.error}>تعذر تحميل المنتجات: {error}</Text>:null}
   {loading&&products.length===0?<ActivityIndicator color={Yosha.colors.primary} style={{margin:24}}/>:null}
  </View>}
  data={visible} numColumns={2} columnWrapperStyle={{gap:12}} keyExtractor={x=>x.id}
  renderItem={({item})=><View style={st.product}>{item.image_urls?.[0]?<Image source={{uri:item.image_urls[0]}} style={st.photo} resizeMode="cover"/>:<View style={[st.photo,st.placeholder]}><BrandMark size={52}/></View>}<View style={st.productInfo}><Text style={st.productName} numberOfLines={2}>{item.name}</Text><Text style={st.price}>{Number(item.price).toLocaleString("en-US")} <Text style={st.currency}>{item.currency}</Text></Text><View style={st.productFoot}><Text style={st.productTag}>متوفر الآن</Text><Ionicons name="arrow-back-circle" size={23} color={Yosha.colors.primary}/></View></View></View>}
  ListEmptyComponent={!loading&&!error?<Text style={st.empty}>لا توجد منتجات مطابقة حالياً.</Text>:null}
  ListFooterComponent={<View style={st.footerBanner}><View style={{flex:1}}><Text style={st.footerTitle}>عندك متجر؟</Text><Text style={st.footerCopy}>انضم إلى مجتمع تجار YOSHA وابدأ عرض منتجاتك.</Text></View><Ionicons name="storefront" size={35} color="#B7EAC7"/></View>}
 />;
}
const st=StyleSheet.create({
 page:{flex:1,backgroundColor:Yosha.colors.background},content:{paddingHorizontal:16,paddingBottom:28},
 top:{flexDirection:"row",alignItems:"center",justifyContent:"space-between",paddingVertical:10,marginBottom:12},bell:{width:42,height:42,borderRadius:14,backgroundColor:"#EAF5ED",alignItems:"center",justifyContent:"center",borderWidth:1,borderColor:Yosha.colors.line},
 hero:{backgroundColor:"#103C25",borderRadius:26,padding:23,minHeight:205,justifyContent:"center",overflow:"hidden",marginBottom:15},heroGlow:{position:"absolute",width:210,height:210,borderRadius:110,backgroundColor:"#1C7545",right:-85,top:-95,opacity:.65},eyebrow:{color:"#A9E5B9",fontSize:9,fontWeight:"900",letterSpacing:2},heroTitle:{color:"#FFFFFF",fontSize:29,fontWeight:"900",textAlign:"right",lineHeight:40,marginTop:11},heroCopy:{color:"#D0E8D7",fontSize:12,textAlign:"right",marginTop:8,lineHeight:20},heroPill:{alignSelf:"flex-end",flexDirection:"row",alignItems:"center",gap:6,backgroundColor:"#FFFFFF18",borderRadius:20,paddingHorizontal:11,paddingVertical:7,marginTop:13},heroPillText:{color:"#E4F8E9",fontSize:10,fontWeight:"700"},
 search:{height:51,borderRadius:15,backgroundColor:"#FFFFFF",borderWidth:1,borderColor:Yosha.colors.line,flexDirection:"row",alignItems:"center",gap:10,paddingHorizontal:14,marginBottom:24},searchInput:{flex:1,textAlign:"right",fontSize:13,color:Yosha.colors.ink},
 sectionHead:{flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginBottom:12,marginTop:2},sectionTitle:{fontSize:17,fontWeight:"900",color:Yosha.colors.ink,textAlign:"right"},sectionHint:{fontSize:10,color:Yosha.colors.muted,textAlign:"right",marginTop:3},store:{width:108,backgroundColor:"#FFFFFF",borderRadius:17,padding:12,alignItems:"center",borderWidth:1,borderColor:Yosha.colors.line},storeMark:{width:45,height:45,borderRadius:16,backgroundColor:Yosha.colors.mint,alignItems:"center",justifyContent:"center"},storeInitial:{fontSize:21,fontWeight:"900",color:Yosha.colors.primary},storeName:{fontSize:11,fontWeight:"800",color:Yosha.colors.text,marginTop:8},storeCaption:{fontSize:9,color:Yosha.colors.muted,marginTop:3},countPill:{backgroundColor:Yosha.colors.mint,paddingHorizontal:10,paddingVertical:6,borderRadius:20},countText:{fontSize:10,color:Yosha.colors.primary,fontWeight:"800"},
 product:{flex:1,backgroundColor:"#FFFFFF",borderRadius:19,marginBottom:12,overflow:"hidden",borderWidth:1,borderColor:Yosha.colors.line},photo:{width:"100%",height:145,backgroundColor:"#EFF7F0"},placeholder:{alignItems:"center",justifyContent:"center"},productInfo:{padding:11},productName:{fontSize:12,fontWeight:"800",color:Yosha.colors.ink,textAlign:"right",minHeight:37,lineHeight:19},price:{fontSize:14,fontWeight:"900",color:Yosha.colors.primary,textAlign:"right",marginTop:7},currency:{fontSize:10,color:Yosha.colors.muted,fontWeight:"700"},productFoot:{flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginTop:9},productTag:{fontSize:9,color:Yosha.colors.muted},empty:{color:Yosha.colors.muted,textAlign:"right",padding:14,fontSize:12},error:{color:Yosha.colors.danger,textAlign:"right",fontSize:12,marginBottom:10},footerBanner:{backgroundColor:"#EAF5ED",borderRadius:20,padding:18,marginTop:16,flexDirection:"row",alignItems:"center",gap:12},footerTitle:{fontSize:17,fontWeight:"900",color:Yosha.colors.forest,textAlign:"right"},footerCopy:{fontSize:11,color:Yosha.colors.muted,textAlign:"right",marginTop:5,lineHeight:18}
});
