import {Stack} from "expo-router";
import {StatusBar} from "expo-status-bar";
import {Yosha} from "../theme";
export default function RootLayout(){return <><StatusBar style="dark" backgroundColor={Yosha.colors.background}/><Stack screenOptions={{headerShown:false,contentStyle:{backgroundColor:Yosha.colors.background}}}/></>;}
