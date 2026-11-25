import {Tabs} from "expo-router";
import {Ionicons} from "@expo/vector-icons";
import {Yosha} from "../../theme";
export default function TabsLayout(){return <Tabs screenOptions={{headerShown:false,tabBarActiveTintColor:Yosha.colors.primary,tabBarInactiveTintColor:"#91A196",tabBarStyle:{height:66,paddingBottom:9,paddingTop:8,borderTopColor:Yosha.colors.line,backgroundColor:"#FFFFFF",elevation:8},tabBarLabelStyle:{fontSize:10,fontWeight:"700"}}}>
<Tabs.Screen name="index" options={{title:"الرئيسية",tabBarLabel:"الرئيسية",tabBarIcon:({color,size})=><Ionicons name="home-outline" color={color} size={size}/>}}/>
<Tabs.Screen name="seller" options={{title:"متجري",tabBarLabel:"متجري",tabBarIcon:({color,size})=><Ionicons name="storefront-outline" color={color} size={size}/>}}/>
<Tabs.Screen name="admin" options={{title:"الإدارة",tabBarLabel:"الإدارة",tabBarIcon:({color,size})=><Ionicons name="grid-outline" color={color} size={size}/>}}/>
<Tabs.Screen name="account" options={{title:"حسابي",tabBarLabel:"حسابي",tabBarIcon:({color,size})=><Ionicons name="person-circle-outline" color={color} size={size}/>}}/>
</Tabs>;}
