import {Stack} from "expo-router";
import {StatusBar} from "expo-status-bar";
import {Yosha} from "../theme";
import {LanguageProvider} from "../lib/i18n";
export default function RootLayout(){return <LanguageProvider><StatusBar style="dark" backgroundColor={Yosha.colors.background}/><Stack screenOptions={{headerShown:false,contentStyle:{backgroundColor:Yosha.colors.background}}}/></LanguageProvider>;}
